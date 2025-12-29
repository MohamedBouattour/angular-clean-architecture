import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, readProjectConfiguration } from '@nx/devkit';

import { cleanFeatureGenerator } from './generator';
import { CleanFeatureGeneratorSchema } from './schema';

describe('clean-feature generator', () => {
  let tree: Tree;
  const options: CleanFeatureGeneratorSchema = { name: 'test' };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await cleanFeatureGenerator(tree, options);
    const modelExists = tree.exists('apps/sandbox/src/app/features/test/domain/model.ts');
    const storeExists = tree.exists('apps/sandbox/src/app/features/test/application/store.ts');
    const componentExists = tree.exists('apps/sandbox/src/app/features/test/ui/component.ts');
    const serviceExists = tree.exists('apps/sandbox/src/app/features/test/infrastructure/service.ts');
    
    expect(modelExists).toBeTruthy();
    expect(storeExists).toBeTruthy();
    expect(componentExists).toBeTruthy();
    expect(serviceExists).toBeTruthy();
  });
});
