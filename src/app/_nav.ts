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
    name: 'Consultorio',
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
        name: 'Médicos',
        url: '/consultorio/medico-listado/',
        icon: 'icon-grid'
      },
      {
        name: 'Pacientes',
        url: '/consultorio/paciente-listado/',
        icon: 'icon-grid'
      }
    ]
  },

  // modulo adacemico
  {
    title: true,
    name: 'Actividades'
  },

  // Menu Consultorio
  {
    name: 'Administración',
    url: '/consultorio/agendar-cita',
    icon: 'icon-cursor',
    children: [
      {
        name: 'Citas y Consultas',
        url: '/consultorio/consulta-medica/',
        icon: 'icon-grid'
      },
    ]
  },
  // Menu Matriculacion
  {
    name: 'Matriculación',
    url: '/matriculas/matricula-estudiante',
    icon: 'icon-cursor',
    children: [
      {
        name: 'Matricula Estudiantil',
        url: '/matriculas/matricula-lista-estudiante/',
        icon: 'icon-grid'
      }
      ,
      {
        name: 'Movilidad Estudiantil',
        url: '/matriculas/movilidad-estudiante/',
        icon: 'icon-grid'
      },
      {
        name: 'Reportes Matriculación',
        url: '/matriculas/reportes-matricula/',
        icon: 'icon-grid'
      },
      {
        name: 'Periodo de Matrícula',
        url: '/matriculas/periodo-matricula/',
        icon: 'icon-grid'
      },
      {
        name: 'Reglamentos',
        url: '/matriculas/creacion-reglamentos/',
        icon: 'icon-grid'
      },
      {
        name: 'Listado Estudiantes',
        url: '/matriculas/estudiante-listado/',
        icon: 'icon-grid'
      },
      {
        name: 'Parametricas',
        url: '/matriculas/parametricas-listado/',
        icon: 'icon-grid'
      }
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

      {
        name: 'Docente asignatura',
        url: '/reportes/docente-asignatura/',
        icon: 'icon-grid'
      }
    ]
  },
  {
    name: 'SALVA GI DENTAL',
    url: 'https://upse.edu.ec',
    icon: 'icon-layers',
    class: 'mt-auto',
    variant: 'success',
    attributes: { target: '_blank', rel: 'noopener' }
  }
];
