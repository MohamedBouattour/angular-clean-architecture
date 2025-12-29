import {
  formatFiles,
  generateFiles,
  joinPathFragments,
  Tree,
} from '@nx/devkit';
import { CleanCoreGeneratorSchema } from './schema';

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

export async function cleanCoreGenerator(
  tree: Tree,
  options: CleanCoreGeneratorSchema
) {
  const targetPath = joinPathFragments(
    'apps/sandbox/src/app/core',
    options.type,
    options.name
  );
  
  const pascalName = toPascalCase(options.name);
  const camelName = toCamelCase(options.name);

  generateFiles(
    tree,
    joinPathFragments(__dirname, 'files', options.type),
    targetPath,
    {
      ...options,
      pascalName,
      camelName,
      tmpl: '',
    }
  );

  await formatFiles(tree);
  
  console.log(`\n✓ Generated core ${options.type} "${options.name}" in ${targetPath}`);
}

export default cleanCoreGenerator;

export interface CleanCoreGeneratorSchema {
  name: string;
  type: 'auth' | 'guard' | 'interceptor' | 'service';
}
