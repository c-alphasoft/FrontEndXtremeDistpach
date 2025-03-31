import { Routes } from '@angular/router';
import { hasRoleGuard } from '../../guards/has-role.guard';

export const AdminRoutes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    canActivate: [hasRoleGuard],
    data: { roles: ['admin'] },
    loadComponent: () =>
      import('../../components/dashboard/dashboard.component').then(
        (comp) => comp.DashboardComponent
      ),
  },
  {
    path: 'dispatch',
    canActivate: [hasRoleGuard],
    data: { roles: ['admin'] },
    children: [
      {
        path: 'states',
        loadComponent: () =>
          import('../../components/offices/states/states.component').then(
            (comp) => comp.StatesComponent
          ),
      },
      {
        path: 'dispatch-list',
        loadComponent: () =>
          import(
            '../../components/offices/dispatch-list/dispatch-list.component'
          ).then((comp) => comp.DispatchListComponent),
      },
    ],
  },
  {
    path: 'planner',
    canActivate: [hasRoleGuard],
    data: { roles: ['admin'] },
    children: [
      {
        path: 'calendar',
        loadComponent: () =>
          import(
            '../../components/planner/fullcalendar/fullcalendar.component'
          ).then((comp) => comp.AppFullcalendarComponent),
      },
      {
        path: 'request-list',
        loadComponent: () =>
          import('../../components/planner/requests/requests.component').then(
            (comp) => comp.RequestsComponent
          ),
      },
      {
        path: 'confirmed',
        loadComponent: () =>
          import('../../components/planner/confirmed/confirmed.component').then(
            (comp) => comp.ConfirmedComponent
          ),
      },
      {
        path: 'plan',
        loadComponent: () =>
          import('../../components/planner/plan/plan.component').then(
            (comp) => comp.PlanComponent
          ),
      },
      {
        path: 'dispatch',
        loadComponent: () =>
          import('../../components/planner/dispatch/dispatch.component').then(
            (comp) => comp.DispatchComponent
          ),
      },
      {
        path: 'new-dispatch',
        loadComponent: () =>
          import(
            '../../components/planner/fullcalendar/request-dispatch/request-dispatch.component'
          ).then((comp) => comp.RequestDispatchComponent),
      },
      {
        path: 'detail-dispatch',
        loadComponent: () =>
          import(
            '../../components/planner/fullcalendar/office-detail/office-detail.component'
          ).then((comp) => comp.OfficeDetailComponent),
      },
      {
        path: 'dispatch-detail',
        loadComponent: () =>
          import(
            '../../components/planner/fullcalendar/dispatch-detail/dispatch-detail.component'
          ).then((comp) => comp.DispatchDetailComponent),
      },
      {
        path: 'edit',
        loadComponent: () =>
          import(
            '../../components/planner/fullcalendar/edit-order/edit-order.component'
          ).then((comp) => comp.EditOrderComponent),
      },
    ],
  },
  {
    path: 'reportability',
    canActivate: [hasRoleGuard],
    data: { roles: ['admin'] },
    children: [
      {
        path: 'reportability-list',
        loadComponent: () =>
          import(
            '../../components/reportability/reportability-list/reportability-list.component'
          ).then((comp) => comp.ReportabilityListComponent),
      },
    ],
  },
  {
    path: 'settings',
    canActivate: [hasRoleGuard],
    data: { roles: ['admin'] },
    children: [
      {
        path: 'users',
        loadComponent: () =>
          import('../../components/settings/users/users.component').then(
            (comp) => comp.UsersComponent
          ),
      },
    ],
  },
];
