import { NavItemUser } from '../interfaces/nav-item-user';

export const navItemsUser: NavItemUser[] = [
  {
    navCap: 'Menú',
  },
  {
    displayName: 'Solicitar',
    iconName: 'calendar-event',
    route: '/user/solicitud',
    roles: ['user'],
  },
  {
    displayName: 'Mis Solicitudes',
    iconName: 'list',
    route: '/user/solicitudes',
    roles: ['user'],
  },
];
