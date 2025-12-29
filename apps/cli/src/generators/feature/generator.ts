import {
  formatFiles,
  Tree,
  generateFiles,
  joinPathFragments,
} from '@nx/devkit';
import inquirer from 'inquirer';
import { CleanFeatureGeneratorSchema } from './schema';
import { toPascalCase, pluralize } from '../../utils/string-utils';



/**
 * Load or create feature schema for persistence
 */
function loadFeatureSchema(tree: Tree): any {
  const schemaPath = 'feature-schema.json';
  if (tree.exists(schemaPath)) {
    const content = tree.read(schemaPath);
    if (content) {
      return JSON.parse(content.toString());
    }
  }
  return {
    version: '1.0',
    lastUpdated: new Date().toISOString(),
    features: {}
  };
}

/**
 * Save feature schema
 */
function saveFeatureSchema(tree: Tree, schema: any): void {
  schema.lastUpdated = new Date().toISOString();
  tree.write('feature-schema.json', JSON.stringify(schema, null, 2));
}

/**
 * Updates app.routes.ts to include the new feature
 */
function updateAppRoutes(tree: Tree, featureName: string, folderName: string, pascalName: string) {
  const routesPath = 'apps/sandbox/src/app/app.routes.ts';
  if (!tree.exists(routesPath)) return;

  let content = tree.read(routesPath)!.toString();
  
  // Check if route already exists
  if (content.includes(`path: '${folderName}'`)) return;

  const newRoute = `  {
    path: '${folderName}',
    loadComponent: () => import('./features/${folderName}/ui/${featureName}.component').then(m => m.${pascalName}Component),
    data: { label: '${pascalName}s' }
  },`;

  // Find the appRoutes array
  const routesArrayRegex = /export const appRoutes: Route\[\] = \[([\s\S]*?)\];/;
  const match = content.match(routesArrayRegex);

  if (match) {
    const existingRoutes = match[1].trim();
    let updatedRoutes = existingRoutes;
    
    if (existingRoutes && !existingRoutes.endsWith(',')) {
      updatedRoutes += ',';
    }
    
    updatedRoutes += `\n${newRoute}`;
    
    content = content.replace(routesArrayRegex, `export const appRoutes: Route[] = [${updatedRoutes}\n];`);
    tree.write(routesPath, content);
  }
}

export async function cleanFeatureGenerator(
  tree: Tree,
  options: CleanFeatureGeneratorSchema
) {
  // 0. Bulk Generation from Schema
  if (!options.name && !options.blueprint) {
      const schema = loadFeatureSchema(tree);
      const featureNames = Object.keys(schema.features || {});
      
      if (featureNames.length > 0) {
        console.log(`\n🚀 Found ${featureNames.length} features in feature-schema.json. Generating...`);
        
        for (const name of featureNames) {
          const feature = schema.features[name];
          // Convert stored attributes back to string format for recursivity or handle manually
           const attributesStr = feature.attributes.map((a: any) => `${a.name}:${a.type}`).join(',');
           
           console.log(`Generating feature: ${name}`);
           await cleanFeatureGenerator(tree, { 
             ...options, 
             name: feature.name, 
             attributes: attributesStr 
           });
        }
        return;
      }
  }

  let featureName = options.name; // Keep original singular name
  let attributes: { name: string; type: string }[] = [];
  let models: { name: string; attributes: { name: string; type: string }[] }[] = [];

  // Load existing schema
  const featureSchema = loadFeatureSchema(tree);

  // 1. Blueprint Mode
  if (options.blueprint) {
    try {
      const blueprintContent = tree.read(options.blueprint);
      if (!blueprintContent) {
        throw new Error(`Blueprint file not found at ${options.blueprint}`);
      }
      const blueprint = JSON.parse(blueprintContent.toString());

      if (!blueprint.name) {
        throw new Error('Blueprint is missing "name" property.');
      }

      featureName = blueprint.name;
      
      if (blueprint.models && Array.isArray(blueprint.models)) {
        models = blueprint.models.map((m: any) => ({
          name: toPascalCase(m.name),
          attributes: m.attributes || []
        }));
      } else {
        models = [{
          name: toPascalCase(featureName),
          attributes: []
        }];
      } 
      
      console.log(`Loaded feature "${featureName}" from blueprint.`);

    } catch (e) {
      console.error(`Error reading blueprint: ${e}`);
      throw e;
    }
  } 


  // 3. Interactive/Manual Mode
  if (!featureName) {
    const questions = [
      {
        type: 'input',
        name: 'name',
        message: 'What is the name of the feature (singular)?',
        validate: (input: string) =>
          input.length > 0 ? true : 'Name is required',
      },
    ];
    const answers = await inquirer.prompt(questions);
    featureName = answers.name;
  }

  // Get attributes if not already loaded
  if (attributes.length === 0 && models.length === 0) {
    if (options.attributes) {
      attributes = options.attributes.split(',').map((attr) => {
        const [n, t] = attr.split(':');
        return { name: n.trim(), type: t?.trim() || 'string' };
      });
    } else {
      console.log("Let's add some attributes (property fields).");
      let addingAttributes = true;

      while (addingAttributes) {
        const { attrName } = await inquirer.prompt([
          {
            type: 'input',
            name: 'attrName',
            message: 'Enter attribute name (or press enter to finish):',
          },
        ]);

        if (!attrName || attrName.trim() === '') {
          addingAttributes = false;
          break;
        }

        const { attrType } = await inquirer.prompt([
          {
            type: 'list',
            name: 'attrType',
            message: 'Select type:',
            choices: ['string', 'number', 'boolean', 'Date', 'any'],
            default: 'string',
          },
        ]);

        attributes.push({ name: attrName, type: attrType });
      }
    }

    // Save to schema for future use
    if (attributes.length > 0) {
      featureSchema.features[featureName] = {
        name: featureName,
        attributes: attributes
      };
      saveFeatureSchema(tree, featureSchema);
      console.log(`✓ Feature schema saved for future use`);
    }
  }

  // Build models if not from blueprint
  if (models.length === 0) {
    models = [{
      name: toPascalCase(featureName), // Singular PascalCase (e.g., "Order")
      attributes: attributes
    }];
  }

  // Generate folder name (pluralized)
  const folderName = pluralize(featureName);
  const targetPath = joinPathFragments('apps/sandbox/src/app/features', folderName);
  
  // Use singular PascalCase for class names
  const singularPascalName = toPascalCase(featureName);
  
  // Extract attributes from the primary model
  const primaryAttributes = models.length > 0 ? models[0].attributes : [];

  // Generate files from templates
  generateFiles(
    tree,
    joinPathFragments(__dirname, 'files'),
    targetPath,
    {
      ...options,
      name: folderName, // Pluralized for folder
      singularName: featureName, // Original singular name
      pascalName: singularPascalName, // Singular PascalCase for classes
      models,
      attributes: primaryAttributes,
      tmpl: '',
    }
  );

  // 4. Update Routes
  updateAppRoutes(tree, featureName, folderName, singularPascalName);

  await formatFiles(tree);
  
  console.log(`\n✓ Generated feature "${featureName}" in ${targetPath}`);
}

export default cleanFeatureGenerator;
