import {
  formatFiles,
  generateFiles,
  joinPathFragments,
  Tree,
} from '@nx/devkit';
// import { CleanCoreGeneratorSchema } from './schema';
import { toPascalCase, toCamelCase } from '../../utils/string-utils';



export async function cleanCoreGenerator(
  tree: Tree,
  options: CleanCoreGeneratorSchema
) {
  if (options.type === 'all') {
    const coreTypes = ['navbar', 'menu', 'theme-selector', 'language-selector', 'translate', 'auth'];
    console.log(`\n🚀 Generating ALL core assets: ${coreTypes.join(', ')}...`);
    
    for (const type of coreTypes) {
      // Use provided name or default to the type name (e.g. 'navbar')
      const name = options.name || type;
      await cleanCoreGenerator(tree, { ...options, type: type as any, name });
    }
    return;
  }

  // Ensure name is present for specific types (default to type name if missing)
  if (!options.name) {
     options.name = options.type;
  }

  const targetPath =
    options.type === 'auth' ||
    options.type === 'translate' ||
    options.type === 'language-selector' ||
    options.type === 'theme-selector' ||
    options.type === 'menu' ||
    options.type === 'navbar'
      ? joinPathFragments('apps/sandbox/src/app/core', options.type)
      : joinPathFragments(
          'apps/sandbox/src/app/core',
          options.type,
          options.name
        );
  
  const pascalName = toPascalCase(options.name!);
  const camelName = toCamelCase(options.name!);

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
  
  console.log(`✓ Generated core ${options.type} "${options.name}" in ${targetPath}`);
}

export default cleanCoreGenerator;

export interface CleanCoreGeneratorSchema {
  name?: string;
  type: 'all' | 'auth' | 'guard' | 'interceptor' | 'service' | 'translate' | 'language-selector' | 'theme-selector' | 'menu' | 'navbar';
}
