import { Routes } from '@angular/router';
import { StatesComponent } from './states/states.component';

export const DispatchRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'states',
        component: StatesComponent,
        data: {
          title: 'Control de Despachos',
        },
      },
    ],
  },
];
