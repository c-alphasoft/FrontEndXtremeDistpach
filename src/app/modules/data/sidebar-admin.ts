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
  {
    displayName: 'Control Despachos',
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
        displayName: 'Programados',
        iconName: 'point',
        route: '/admin/planner/confirmed',
      },
      {
        displayName: 'Procesados',
        iconName: 'point',
        route: '/admin/planner/processed',
      },
      {
        displayName: 'Despachados',
        iconName: 'point',
        route: 'offices',
        roles: ['admin', 'planner', 'dispatcher'],
        children: [
          {
            displayName: 'Guías Softland',
            iconName: 'point',
            route: '/admin/planner/offices/softland',
            roles: ['admin', 'planner', 'dispatcher'],
          },
          {
            displayName: 'Guías Provisorias',
            iconName: 'point',
            route: '/admin/planner/offices/provisional',
            roles: ['admin', 'planner', 'dispatcher'],
          },
        ],
      },
      {
        displayName: 'Finalizados',
        iconName: 'point',
        route: '/admin/planner/request-list',
        roles: ['admin', 'planner', 'dispatcher'],
      },
    ],
  },
  {
    displayName: 'Configuración',
    iconName: 'Settings',
    route: 'settings',
    children: [
      {
        displayName: 'Usuarios',
        iconName: 'point',
        route: '/admin/settings/users',
      },
      {
        displayName: 'Contratos',
        iconName: 'point',
        route: '/admin/settings/contracts',
      },
      {
        displayName: 'Clientes',
        iconName: 'point',
        route: '/admin/settings/customers',
      },
      {
        displayName: 'Equipos',
        iconName: 'point',
        route: '/admin/settings/teams',
      },
      {
        displayName: 'Planteros',
        iconName: 'point',
        route: '/admin/settings/planters',
      },
      {
        displayName: 'Plantas',
        iconName: 'point',
        route: '/admin/settings/floors',
      },
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
