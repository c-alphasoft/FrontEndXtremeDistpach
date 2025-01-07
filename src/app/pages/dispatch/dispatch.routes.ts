import { Routes } from '@angular/router';
import { StatesComponent } from './states/states.component';
import { DispatchListComponent } from './dispatch-list/dispatch-list.component';

export const DispatchRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'states',
        component: StatesComponent,
        data: {
          title: 'Estado de Despacho',
        },
      },
      {
        path: 'dispatch-list',
        component: DispatchListComponent,
        data: {
          title: 'Control de Despachos',
        },
      },
    ],
  },
];
