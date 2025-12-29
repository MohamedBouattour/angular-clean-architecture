#!/usr/bin/env node
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const args = process.argv.slice(2);

function findWorkspaceRoot(dir) {
  if (fs.existsSync(path.join(dir, 'nx.json')) || fs.existsSync(path.join(dir, 'package.json'))) {
    // Check if it's the monorepo root (has apps/cli)
    if (fs.existsSync(path.join(dir, 'nx.json'))) {
        return dir;
    }
  }
  const parent = path.dirname(dir);
  if (parent === dir) return null;
  return findWorkspaceRoot(parent);
}

const root = findWorkspaceRoot(process.cwd());

// Map "generate feature <name>" to "nx g cli:feature --name=<name>"
// Example: aca generate feature products --attributes="..."
if (args[0] === 'generate' && args[1] === 'feature') {
  const name = args[2];
  const remainingArgs = args.slice(3);
  
  const nxArgs = ['g', 'cli:feature'];
  
  if (name && !name.startsWith('-')) {
    nxArgs.push(`--name=${name}`);
  }
  
  // Pass through other flags like --attributes or --blueprint
  remainingArgs.forEach(arg => {
      nxArgs.push(arg);
  });
  
  console.log(`Executing: npx nx ${nxArgs.join(' ')}`);
  
  const child = spawn('npx', ['nx', ...nxArgs], {
    stdio: 'inherit',
    shell: true,
    cwd: root || process.cwd(),
  });
  
  child.on('exit', (code) => {
    process.exit(code || 0);
  });
} else {
  console.log('\x1b[36m%s\x1b[0m', 'Angular Clean Architecture CLI');
  console.log('');
  console.log('Usage:');
  console.log('  aca generate feature <name> [options]');
  console.log('');
  console.log('Options:');
  console.log('  --attributes="name:type,..."  Define model attributes');
  console.log('  --blueprint=path/to/file.json Use a blueprint file');
  console.log('  --interactive                 Run in interactive mode');
  console.log('');
  console.log('Example:');
  console.log('  aca generate feature products --attributes="name:string,price:number"');
  process.exit(0);
}
