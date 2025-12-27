import {
  formatFiles,
  Tree,
  generateFiles,
  joinPathFragments,
} from '@nx/devkit';
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
    .map(part => capitalizeFirst(part))
    .join('');
}

export async function cleanFeatureGenerator(
  tree: Tree,
  options: CleanFeatureGeneratorSchema
) {
  const name = options.name;
  const targetPath = joinPathFragments('apps/sandbox/src/app/features', name);

  // Format names for templates
  const pascalName = toPascalCase(name);
  
  // Parse attributes
  let attributes: { name: string; type: string }[] = [];
  
  if (options.attributes) {
    attributes = options.attributes.split(',').map(attr => {
      const [name, type] = attr.split(':');
      return { name, type: type || 'string' };
    });
  } else {
    // If running in interactive mode (and no attributes provided), we could prompt
    // But since this runs in Nx context, standard inquirer might conflict if not handled carefully
    // For now we'll support the --attributes flag passed from the interactive CLI wrapper
    attributes = [
      { name: 'createdAt', type: 'Date' },
      { name: 'updatedAt', type: 'Date' }
    ];
  }

  // Generate files from templates
  generateFiles(
    tree,
    joinPathFragments(__dirname, 'files'),
    targetPath,
    {
      ...options,
      name,
      pascalName,
      attributes,
      tmpl: '',
    }
  );

  await formatFiles(tree);
}

export default cleanFeatureGenerator;
