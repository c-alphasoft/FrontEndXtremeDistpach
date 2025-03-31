import { Routes } from '@angular/router';
import { hasRoleGuard } from '../guards/has-role.guard';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'admin',
    canActivate: [hasRoleGuard],
    data: { roles: ['admin'] },
    loadComponent: () =>
      import('./admin/admin.component').then((comp) => comp.AdminComponent),
    loadChildren: () =>
      import('./admin/admin.routes').then((router) => router.AdminRoutes),
  },
  {
    path: 'planner',
    canActivate: [hasRoleGuard],
    data: { roles: ['planner'] },
    loadComponent: () =>
      import('./planner/planner.component').then(
        (comp) => comp.PlannerComponent
      ),
  },
  {
    path: 'user',
    canActivate: [hasRoleGuard],
    data: { roles: ['user'] },
    loadComponent: () =>
      import('./user/user.component').then((comp) => comp.UserComponent),
    loadChildren: () =>
      import('./user/user.routes').then((router) => router.UserRoutes),
  },
  {
    path: 'manager',
    canActivate: [hasRoleGuard],
    data: { roles: ['manager'] },
    loadComponent: () =>
      import('./manager/manager.component').then(
        (comp) => comp.ManagerComponent
      ),
  },
  {
    path: 'customer',
    canActivate: [hasRoleGuard],
    data: { roles: ['customer'] },
    loadComponent: () =>
      import('./customer/customer.component').then(
        (comp) => comp.CustomerComponent
      ),
  },
];
export default routes;
