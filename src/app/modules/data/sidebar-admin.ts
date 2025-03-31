import { NavItemAdmin } from '../interfaces/nav-item-admin';

export const navItemsAdmin: NavItemAdmin[] = [
  {
    navCap: 'Menú',
  },
  {
    displayName: 'Dashboard',
    iconName: 'aperture',
    route: '/admin/dashboard',
    roles: ['admin', 'planner', 'dispatcher'],
  },
  // {
  //   displayName: 'Despachos',
  //   iconName: 'file-invoice',
  //   route: 'dispatch',
  //   children: [
  //     {
  //       displayName: 'Control',
  //       iconName: 'point',
  //       route: '/admin/dispatch/dispatch-list',
  //     },
  //     {
  //       displayName: 'Flujo',
  //       iconName: 'point',
  //       route: '/admin/dispatch/states',
  //     },
  //   ],
  // },
  {
    displayName: 'Planificador',
    iconName: 'calendar-event',
    route: 'planner',
    children: [
      {
        displayName: 'Solicitar',
        iconName: 'point',
        route: '/admin/planner/calendar',
        roles: ['admin', 'planner', 'dispatcher', 'user'],
      },
      {
        displayName: 'Solicitudes',
        iconName: 'point',
        route: '/admin/planner/request-list',
        roles: ['admin', 'planner', 'dispatcher', 'user'],
      },
      // {
      //   displayName: 'Confirmado',
      //   iconName: 'point',
      //   route: '/admin/planner/confirmed',
      // },
      // {
      //   displayName: 'Planificado',
      //   iconName: 'point',
      //   route: '/admin/planner/plan',
      // },
      // {
      //   displayName: 'Despacho',
      //   iconName: 'point',
      //   route: '/admin/planner/dispatch',
      // },
    ],
  },
  // {
  //   displayName: 'Reportabilidad',
  //   iconName: 'chart-dots',
  //   route: 'reportability',
  //   children: [
  //     {
  //       displayName: 'Reportes',
  //       iconName: 'point',
  //       route: '/admin/reportability/reportability-list',
  //     },
  //   ],
  // },
  // {
  //   displayName: 'Configuración',
  //   iconName: 'Settings',
  //   route: 'settings',
  //   children: [
  //     {
  //       displayName: 'Usuarios',
  //       iconName: 'point',
  //       route: '/admin/settings/users',
  //     },
  //   ],
  // },
];
