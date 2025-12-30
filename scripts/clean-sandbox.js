/**
 * Clean script for sandbox - deletes core, shared, features folders and resets routes
 */
const fs = require('fs');
const path = require('path');

const sandboxAppPath = 'apps/sandbox/src/app';

// Folders to delete
const foldersToDelete = ['core', 'shared', 'features'];

// Delete folders
foldersToDelete.forEach(folder => {
  const folderPath = path.join(sandboxAppPath, folder);
  if (fs.existsSync(folderPath)) {
    fs.rmSync(folderPath, { recursive: true });
    console.log(`✓ Deleted: ${folderPath}`);
  } else {
    console.log(`  Skipped (not found): ${folderPath}`);
  }
});

// Reset app.routes.ts with auth routes
const routesContent = `import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./core/auth/login.component').then((m) => m.LoginComponent),
    data: { hideNav: true },
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./core/auth/signup.component').then((m) => m.SignupComponent),
    data: { hideNav: true },
  },
];
`;

const routesPath = path.join(sandboxAppPath, 'app.routes.ts');
fs.writeFileSync(routesPath, routesContent);
console.log(`✓ Reset: ${routesPath}`);

console.log('\n✅ Sandbox cleaned successfully!');
