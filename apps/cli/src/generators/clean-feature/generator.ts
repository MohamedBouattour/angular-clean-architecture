import {
  formatFiles,
  Tree,
  generateFiles,
  joinPathFragments,
} from '@nx/devkit';
import { CleanFeatureGeneratorSchema } from './schema';

export async function cleanFeatureGenerator(
  tree: Tree,
  options: CleanFeatureGeneratorSchema
) {
  const name = options.name;
  const targetPath = joinPathFragments('apps/sandbox/src/app/features', name);

  // Generate files from templates
  generateFiles(
    tree,
    joinPathFragments(__dirname, 'files'),
    targetPath,
    {
      ...options,
      name,
      tmpl: '',
    }
  );

  await formatFiles(tree);
}

export default cleanFeatureGenerator;
