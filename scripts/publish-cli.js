const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Publishing CLI to NPM...');

try {
  // 1. Build the CLI
  console.log('📦 Building CLI...');
  execSync('nx build cli', { stdio: 'inherit' });

  // 2. Copy README to dist
  console.log('📄 Copying README...');
  fs.copyFileSync(
    path.join(__dirname, '../apps/cli/README.md'), 
    path.join(__dirname, '../dist/apps/cli/README.md')
  );

  // 3. Publish
  console.log('⬆️  Publishing...');
  process.chdir(path.join(__dirname, '../dist/apps/cli'));
  execSync('npm publish --access public', { stdio: 'inherit' });

  console.log('✅ Published successfully!');
} catch (error) {
  console.error('❌ Failed to publish:', error.message);
  process.exit(1);
}
