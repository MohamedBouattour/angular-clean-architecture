import { Route } from '@angular/router';

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
  {
    path: 'products',
    loadComponent: () =>
      import('./features/products/ui/product.component').then(
        (m) => m.ProductComponent,
      ),
    data: { label: 'Products' },
  },
  {
    path: 'books',
    loadComponent: () =>
      import('./features/books/ui/book.component').then((m) => m.BookComponent),
    data: { label: 'Books' },
  },
  {
    path: 'authors',
    loadComponent: () =>
      import('./features/authors/ui/author.component').then(
        (m) => m.AuthorComponent,
      ),
    data: { label: 'Authors' },
  },
  {
    path: 'publishers',
    loadComponent: () =>
      import('./features/publishers/ui/publisher.component').then(
        (m) => m.PublisherComponent,
      ),
    data: { label: 'Publishers' },
  },
];
