import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    {
      path: 'auth/login',
      loadComponent: () =>
        import('./auth/login/login.component').then(
          (comp) => comp.LoginComponent
        ),
    },
    {
      path: '',
      canActivate: [authGuard],
      loadChildren: () =>
        import('./pages/page.routes').then((router) => router.default),
    },
    { path: '**', redirectTo: '/auth/login' }
];
