import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree } from '@nx/devkit';

import { featureGenerator } from './generator';
import { FeatureGeneratorSchema } from './schema';

describe('feature generator', () => {
  let tree: Tree;
  const options: FeatureGeneratorSchema = {
    name: 'test',
    attributes: 'name:string,age:number',
  };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await featureGenerator(tree, options);
    const modelExists = tree.exists(
      'apps/sandbox/src/app/features/tests/domain/model.ts',
    );
    const storeExists = tree.exists(
      'apps/sandbox/src/app/features/tests/application/store.ts',
    );
    const componentExists = tree.exists(
      'apps/sandbox/src/app/features/tests/ui/test.component.ts',
    );
    const serviceExists = tree.exists(
      'apps/sandbox/src/app/features/tests/infrastructure/service.ts',
    );

    expect(modelExists).toBeTruthy();
    expect(storeExists).toBeTruthy();
    expect(componentExists).toBeTruthy();
    expect(serviceExists).toBeTruthy();
  });
});
