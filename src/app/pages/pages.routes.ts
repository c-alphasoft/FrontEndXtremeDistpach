import { Routes } from '@angular/router';
import { StarterComponent } from './starter/starter.component';
import { AppFullcalendarComponent } from './planner/fullcalendar/fullcalendar.component';

export const PagesRoutes: Routes = [
  {
    path: '',
    component: StarterComponent,
    data: {
      title: 'Dashboard',
    },
  },
];
