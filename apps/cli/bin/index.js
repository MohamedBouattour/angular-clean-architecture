#!/usr/bin/env node
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const args = process.argv.slice(2);

function findWorkspaceRoot(dir) {
  if (fs.existsSync(path.join(dir, 'nx.json')) || fs.existsSync(path.join(dir, 'package.json'))) {
    if (fs.existsSync(path.join(dir, 'nx.json'))) {
        return dir;
    }
  }
  const parent = path.dirname(dir);
  if (parent === dir) return null;
  return findWorkspaceRoot(parent);
}

const root = findWorkspaceRoot(process.cwd());

/**
 * Executes an Nx generator command
 * @param {string} generator - The generator name (e.g., 'feature', 'core', 'shared')
 * @param {string[]} remainingArgs - Additional arguments to pass
 */
function runGenerator(generator, remainingArgs) {
  const nxArgs = ['g', `cli:${generator}`];
  
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
}

// Parse commands
if (args[0] === 'generate' || args[0] === 'g') {
  const generatorType = args[1];
  const remainingArgs = args.slice(2);
  
  // Parse name from positional argument
  const nxArgs = [];
  if (remainingArgs[0] && !remainingArgs[0].startsWith('-')) {
    nxArgs.push(`--name=${remainingArgs[0]}`);
    remainingArgs.shift();
  }
  
  // Pass through all other flags
  remainingArgs.forEach(arg => nxArgs.push(arg));
  
  switch (generatorType) {
    case 'feature':
    case 'f':
      runGenerator('feature', nxArgs);
      break;
    case 'core':
    case 'c':
      runGenerator('core', nxArgs);
      break;
    case 'shared':
    case 's':
      runGenerator('shared', nxArgs);
      break;
    default:
      console.log('\x1b[31m%s\x1b[0m', `Unknown generator: ${generatorType}`);
      console.log('Available generators: feature (f), core (c), shared (s)');
      process.exit(1);
  }
} else {
  console.log('\x1b[36m%s\x1b[0m', 'Angular Clean Architecture CLI');
  console.log('');
  console.log('Usage:');
  console.log('  aca generate <generator> [name] [options]');
  console.log('  aca g <generator> [name] [options]');
  console.log('');
  console.log('Generators:');
  console.log('  feature (f)   Generate a Clean Architecture feature');
  console.log('  core (c)      Generate a core asset (auth, guard, interceptor, etc.)');
  console.log('  shared (s)    Generate a shared component or utility');
  console.log('');
  console.log('Examples:');
  console.log('  aca g feature products --attributes="name:string,price:number"');
  console.log('  aca g core auth-service --type=service');
  console.log('  aca g core app --type=navbar');
  console.log('  aca g shared button --type=ui');
  console.log('');
  console.log('Run without options for interactive mode:');
  console.log('  aca g feature');
  console.log('  aca g core');
  process.exit(0);
}

