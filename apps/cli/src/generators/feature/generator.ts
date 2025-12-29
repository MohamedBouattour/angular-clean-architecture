import {
  formatFiles,
  Tree,
  generateFiles,
  joinPathFragments,
} from '@nx/devkit';
import * as inquirer from 'inquirer';
import { CleanFeatureGeneratorSchema } from './schema';

/**
 * Capitalizes the first letter of a string
 */
function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Converts a kebab-case or camelCase string to PascalCase
 */
function toPascalCase(str: string): string {
  return str
    .split('-')
    .map((part) => capitalizeFirst(part))
    .join('');
}

/**
 * Pluralizes a word (simple implementation)
 */
function pluralize(word: string): string {
  if (word.endsWith('s')) return word;
  if (word.endsWith('y')) return word.slice(0, -1) + 'ies';
  return word + 's';
}

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
  // 2. Check for saved schema
  else if (!featureName && Object.keys(featureSchema.features).length > 0) {
    const { useSchema } = await inquirer.prompt([
      {
        type: 'list',
        name: 'useSchema',
        message: 'Found existing feature schemas. What would you like to do?',
        choices: [
          { name: 'Create new feature', value: 'new' },
          { name: 'Use saved schema', value: 'use' },
          { name: 'View saved features', value: 'view' }
        ]
      }
    ]);

    if (useSchema === 'view') {
      console.log('\nSaved features:');
      Object.keys(featureSchema.features).forEach(key => {
        const feature = featureSchema.features[key];
        console.log(`  - ${key}: ${feature.attributes.map((a: any) => `${a.name}:${a.type}`).join(', ')}`);
      });
      
      const { proceed } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'proceed',
          message: 'Would you like to use one of these schemas?',
          default: true
        }
      ]);

      if (proceed) {
        const { selectedFeature } = await inquirer.prompt([
          {
            type: 'list',
            name: 'selectedFeature',
            message: 'Select a feature schema:',
            choices: Object.keys(featureSchema.features)
          }
        ]);
        
        const savedFeature = featureSchema.features[selectedFeature];
        featureName = savedFeature.name;
        attributes = savedFeature.attributes;
      }
    } else if (useSchema === 'use') {
      const { selectedFeature } = await inquirer.prompt([
        {
          type: 'list',
          name: 'selectedFeature',
          message: 'Select a feature schema:',
          choices: Object.keys(featureSchema.features)
        }
      ]);
      
      const savedFeature = featureSchema.features[selectedFeature];
      featureName = savedFeature.name;
      attributes = savedFeature.attributes;
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
