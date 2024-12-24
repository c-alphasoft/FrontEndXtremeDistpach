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
        route: "/dispatch/states",
      },
      {
        displayName: "Mapa",
        iconName: "point",
        route: "/",
      },
    ],
  },
  {
    displayName: "Planificardor",
    iconName: "calendar-event",
    route: 'dispatch',
    children: [
      {
        displayName: "Calendario",
        iconName: "point",
        route: "/",
      },
      {
        displayName: "Lista",
        iconName: "point",
        route: "/",
      },
      {
        displayName: "Crear",
        iconName: "point",
        route: "/",
      },
      {
        displayName: "Editar",
        iconName: "point",
        route: "/",
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
    route: 'dispatch',
    children: [
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
