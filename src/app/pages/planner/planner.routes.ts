import { Routes } from '@angular/router';
import { AppFullcalendarComponent } from './fullcalendar/fullcalendar.component';
import { AppPaginationTableComponent } from './pagination-table/pagination-table.component';

export const PlannerRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'fullcalendar',
        component: AppFullcalendarComponent,
        data: {
          title: 'Calendario',
        },
      },
      {
        path: 'data-table',
        component: AppPaginationTableComponent,
        data: {
          title: 'Lista de Despachos',
        },
      },
    ],
  },
];