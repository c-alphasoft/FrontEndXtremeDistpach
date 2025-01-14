import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    navCap: "Menú",
  },
  {
    displayName: "Dashboard",
    iconName: "aperture",
    route: "/starter",
  },
  {
    displayName: "Despachos",
    iconName: "file-invoice",
    route: 'dispatch',
    children: [
      {
        displayName: "Control",
        iconName: "point",
        route: "/dispatch/dispatch-list",
      },
      {
        displayName: "Mapa",
        iconName: "point",
        route: "/dispatch/states",
      },
    ],
  },
  {
    displayName: "Planificardor",
    iconName: "calendar-event",
    route: 'planner',
    children: [
      {
        displayName: "Calendario",
        iconName: "point",
        route: "/planner/fullcalendar",
      },
      {
        displayName: "Lista",
        iconName: "point",
        route: "/planner/data-table",
      },
    ],
  },
  {
    displayName: "Reportabilidad",
    iconName: "chart-dots",
    route: "/",
  },
  {
    displayName: "Auditoria",
    iconName: "ticket",
    route: "/",
  },
  {
    displayName: "Configuración",
    iconName: "Settings",
    route: 'settings',
    children: [
      {
        displayName: "Usuarios",
        iconName: "point",
        route: "/settings/users",
      },
      {
        displayName: "Flota",
        iconName: "point",
        route: "/",
      },
      {
        displayName: "Parametros",
        iconName: "point",
        route: "/",
      },
    ],
  },
];
