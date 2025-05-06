import { NavItemPlanner } from '../interfaces/nav-iten-planner';

export const navItemsPlanner: NavItemPlanner[] = [
  {
    navCap: 'Menú',
  },
  {
    displayName: 'Solicitar',
    iconName: 'calendar-event',
    route: '/planner/calendar-planner',
    roles: ['planner'],
  },
  {
    displayName: 'Programados',
    iconName: 'point',
    route: '/planner/confirmed',
  },
  {
    displayName: 'Procesados',
    iconName: 'point',
    route: '/planner/processed',
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
];
