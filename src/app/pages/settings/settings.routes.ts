import { Routes } from "@angular/router";
import { UsersComponent } from "./users/users.component";

export const SettingsRoutes: Routes = [
    {
      path: '',
      children: [
        {
          path: 'users',
          component:  UsersComponent,
          data: {
            title: 'Usuarios',
          },
        },
      ],
    },
  ];