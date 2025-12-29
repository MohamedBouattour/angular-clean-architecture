import {
  formatFiles,
  generateFiles,
  joinPathFragments,
  Tree,
} from '@nx/devkit';
import { CleanSharedGeneratorSchema } from './schema';

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
 * Converts a string to camelCase
 */
function toCamelCase(str: string): string {
  const pascal = toPascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

export async function cleanSharedGenerator(
  tree: Tree,
  options: CleanSharedGeneratorSchema
) {
  const targetPath = joinPathFragments(
    'apps/sandbox/src/app/shared',
    options.type,
    options.name
  );
  
  const pascalName = toPascalCase(options.name);

  generateFiles(
    tree,
    joinPathFragments(__dirname, 'files', options.type),
    targetPath,
    {
      ...options,
      pascalName,
      camelName: toCamelCase(options.name),
      tmpl: '',
    }
  );

  await formatFiles(tree);
  
  console.log(`\n✓ Generated shared ${options.type} "${options.name}" in ${targetPath}`);
}

export default cleanSharedGenerator;

export interface CleanSharedGeneratorSchema {
  name: string;
  type: 'ui' | 'util';
}
