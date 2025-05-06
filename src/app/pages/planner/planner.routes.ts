import { Routes } from '@angular/router';

export const PlannerRoutes: Routes = [
  {
    path: '',
    children: [
      { path: '', redirectTo: 'calendar-planner', pathMatch: 'full' },
      {
        path: 'calendar-planner',
        loadComponent: () =>
          import(
            '../../components/user-planner/calendar/calendar.component'
          ).then((comp) => comp.CalendarComponent),
      },
      {
        path: 'new-distpach-planner',
        loadComponent: () =>
          import(
            '../../components/user-planner/request-dispatch/request-dispatch.component'
          ).then((comp) => comp.RequestDispatchComponent),
      },
      {
        path: 'edit',
        loadComponent: () =>
          import(
            '../../components/user-planner/edit-order/edit-order.component'
          ).then((comp) => comp.EditOrderComponent),
      },
      {
        path: 'detail-order',
        loadComponent: () =>
          import(
            '../../components/user-planner/detail-order/detail-order.component'
          ).then((comp) => comp.DetailOrderComponent),
      },
      {
        path: 'detail-distpach',
        loadComponent: () =>
          import(
            '../../components/user-planner/detail-distpach/detail-distpach.component'
          ).then((comp) => comp.DetailDistpachComponent),
      },
      {
        path: 'edit-distpach',
        loadComponent: () =>
          import(
            '../../components/user-planner/edit-distpach/edit-distpach.component'
          ).then((comp) => comp.EditDistpachComponent),
      },
      {
        path: 'confirmed',
        loadComponent: () =>
          import(
            '../../components/user-planner/confirmed/confirmed.component'
          ).then((comp) => comp.ConfirmedComponent),
      },
      {
        path: 'processed',
        loadComponent: () =>
          import(
            '../../components/user-planner/processed/processed.component'
          ).then((comp) => comp.ProcessedComponent),
      },
    ],
  },
];
