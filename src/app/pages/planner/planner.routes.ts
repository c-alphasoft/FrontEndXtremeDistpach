import { Routes } from '@angular/router';
import { AppFullcalendarComponent } from './fullcalendar/fullcalendar.component';
import { AppKichenSinkComponent } from './list/datatable/kichen-sink/kichen-sink.component';

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
        component: AppKichenSinkComponent,
        data: {
          title: 'Lista de Despachos',
        },
      },
    ],
  },
];