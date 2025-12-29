import { Route } from '@angular/router';

export const appRoutes: Route[] = [{
    path: 'books',
    loadComponent: () => import('./features/books/ui/book.component').then(m => m.BookComponent),
    data: { label: 'Books' }
  },
  {
    path: '',
    redirectTo: 'books',
    pathMatch: 'full'
  },
  {
    path: 'authors',
    loadComponent: () => import('./features/authors/ui/author.component').then(m => m.AuthorComponent),
    data: { label: 'Authors' }
  },
];
