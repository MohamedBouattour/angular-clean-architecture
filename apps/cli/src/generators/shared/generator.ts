import {
  formatFiles,
  generateFiles,
  joinPathFragments,
  Tree,
} from '@nx/devkit';
import { toPascalCase, toCamelCase } from '../../utils/string-utils';

export async function sharedGenerator(
  tree: Tree,
  options: SharedGeneratorSchema,
) {
  // Default to 'all' if no type specified
  if (!options.type) {
    options.type = 'all';
  }

  if (options.type === 'all') {
    // Generate a standard set of UI components
    const commonComponents = ['confirm-dialog'];
    console.log(
      `\n🚀 Generating standard shared UI components: ${commonComponents.join(', ')}...`,
    );

    for (const name of commonComponents) {
      await sharedGenerator(tree, { ...options, type: 'ui', name });
    }
    return;
  }

  if (!options.name) {
    if (options.type === 'ui') options.name = 'button'; // default
    if (options.type === 'util') options.name = 'format'; // default
  }

  const targetPath = joinPathFragments(
    'apps/sandbox/src/app/shared',
    options.type,
    options.name!,
  );

  const pascalName = toPascalCase(options.name!);

  generateFiles(
    tree,
    joinPathFragments(__dirname, 'files', options.type),
    targetPath,
    {
      ...options,
      pascalName,
      camelName: toCamelCase(options.name!),
      tmpl: '',
    },
  );

  await formatFiles(tree);

  console.log(
    `✓ Generated shared ${options.type} "${options.name}" in ${targetPath}`,
  );
}

export default sharedGenerator;

export interface SharedGeneratorSchema {
  name?: string;
  type: 'all' | 'ui' | 'util';
}
