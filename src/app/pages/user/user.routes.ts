import { Routes } from '@angular/router';

export const UserRoutes: Routes = [
  {
    path: '',
    children: [
      { path: '', redirectTo: 'solicitud', pathMatch: 'full' },
      {
        path: 'solicitud',
        loadComponent: () =>
          import('../../components/user/calendar/calendar.component').then(
            (comp) => comp.CalendarComponent
          ),
      },
      {
        path: 'solicitudes',
        loadComponent: () =>
          import(
            '../../components/user/request-list/request-list.component'
          ).then((comp) => comp.RequestListComponent),
      },
      {
        path: 'new-dispatch',
        loadComponent: () =>
          import(
            '../../components/user/request-dispatch/request-dispatch.component'
          ).then((comp) => comp.RequestDispatchComponent),
      },
      {
        path: 'edit',
        loadComponent: () =>
          import('../../components/user/edit-order/edit-order.component').then(
            (comp) => comp.EditOrderComponent
          ),
      },
      {
        path: 'detail-dispatch',
        loadComponent: () =>
          import(
            '../../components/user/office-detail/office-detail.component'
          ).then((comp) => comp.OfficeDetailComponent),
      },
    ],
  },
];
