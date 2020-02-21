interface NavAttributes {
  [propName: string]: any;
}
interface NavWrapper {
  attributes: NavAttributes;
  element: string;
}
interface NavBadge {
  text: string;
  variant: string;
}
interface NavLabel {
  class?: string;
  variant: string;
}

export interface NavData {
  name?: string;
  url?: string;
  icon?: string;
  badge?: NavBadge;
  title?: boolean;
  children?: NavData[];
  variant?: string;
  attributes?: NavAttributes;
  divider?: boolean;
  class?: string;
  label?: NavLabel;
  wrapper?: NavWrapper;
}

export const navItems: NavData[] = [
  {
    name: 'Distrito Santa Elena',
    url: '/dashboard',
    icon: 'icon-speedometer',
    badge: {
      variant: 'info',
      text: 'Menú'
    }
  },
  // Modulo de mantenimiento
  {
    title: true,
    name: 'Seguridad'
  },

  // Menu Seguridad
  {
    name: 'Seguridad',
    url: '/seguridad/usuarios/',
    icon: 'icon-cursor',
    children: [
      {
        name: 'Comisionados',
        url: '/scout/medico-listado/',
        icon: 'icon-grid'
      },
      {
        name: 'Scouts',
        url: '/scout/paciente-listado/',
        icon: 'icon-grid'
      }
    ]
  },

  // modulo adacemico
  {
    title: true,
    name: 'Revisión de Avance de Insignias'
  },

  // Menu Consultorio
  {
    name: 'Progresión',
    icon: 'icon-cursor',
    children: [
      {
        name: 'Módulos Habilitados',
        url: '/scout/subir-archivo/',
        icon: 'icon-grid'
      },
      {
        name: 'Revisar Módulo',
        url: '/scout/revisar-archivo/',
        icon: 'icon-grid'
      },
      {
        name: 'Listado de Progresión Scout',
        url: '/scout/progresion-listado/',
        icon: 'icon-grid'
      },
    ]
  },

  //Menu Reportes
  {
    name: 'Reportes',
    url: '/reportes/distributivo/',
    icon: 'icon-cursor',
    children: [
      {
        name: 'Distributivo',
        url: '/reportes/distributivo/',
        icon: 'icon-grid'
      },
    ]
  },
  {
    name: 'Scouts Distrito Santa Elena',
    url: 'https://www.scoutsecuador.org/site/grupos-scouts',
    icon: 'icon-layers',
    class: 'mt-auto',
    variant: 'success',
    attributes: { target: '_blank', rel: 'noopener' }
  }
];
