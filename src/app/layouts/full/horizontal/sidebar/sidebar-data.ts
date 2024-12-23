import { NavItem } from '../../vertical/sidebar/nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    navCap: "Menú",
  },
  {
    displayName: "Dashboard",
    iconName: "aperture",
    route: "/starte",
  },
  {
    displayName: "Despacho",
    iconName: "file-invoice",
    children: [
      {
        displayName: "Control",
        iconName: "point",
        route: "/",
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
