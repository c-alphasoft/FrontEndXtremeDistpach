import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    navCap: 'Menu',
  },
  {
    displayName: 'Dashboard',
    iconName: 'layout-dashboard',
  },
  {
    displayName: 'Despacho',
    iconName: 'truck',
    children: [
      {
        displayName: 'Control Despacho',
        iconName: 'point',
        route: '/',
      },
      {
        displayName: 'Mapa',
        iconName: 'point',
        route: '/',
      },
    ],
  },
  {
    displayName: 'Planificador',
    iconName: 'calendar-week',
    route: '/authentication/register',
  },
  {
    displayName: 'Reportabilidad',
    iconName: 'clipboard-data',
    route: '/authentication/register',
  },
  {
    displayName: 'Auditoria',
    iconName: 'eye-edit',
    route: '/authentication/register',
  },
  {
    displayName: 'Configuración',
    iconName: 'settings-cog',
    route: '/',
    children: [
      {
        displayName: 'Flota',
        iconName: 'point',
        route: '/',
      },
      {
        displayName: 'Parametros',
        iconName: 'point',
        route: '/',
      },
    ]
  },
];
