// SVG icon strings for use in Angular (DomSanitizer)
const ICONS = {
  fileText: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>`,
  calendarCheck: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="m9 16 2 2 4-4"/></svg>`,
  graduationCap: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`,
  bookOpen: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`,
  dollarSign: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
  barChart3: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>`,
  messageSquare: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
  megaphone: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg>`,
  checkCircle2: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>`,
  newspaper: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/></svg>`,
  settings: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>`,
  users: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  activity: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`,
  clock: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  tags: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5H2v7l6.29 6.29c.94.94 2.48.94 3.42 0l3.58-3.58c.94-.94.94-2.48 0-3.42L9 5Z"/><path d="M6 9.01V9"/><path d="m15 5 6.3 6.3a2.4 2.4 0 0 1 0 3.4L17 19"/></svg>`,
  wallet: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>`,
  creditCard: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>`,
  landmark: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" x2="21" y1="22" y2="22"/><line x1="6" x2="6" y1="18" y2="11"/><line x1="10" x2="10" y1="18" y2="11"/><line x1="14" x2="14" y1="18" y2="11"/><line x1="18" x2="18" y1="18" y2="11"/><polygon points="12 2 20 7 4 7"/></svg>`,
  calendar: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>`,
  school: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m4 6 8-4 8 4"/><path d="m18 10 4 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8l4-2"/><path d="M14 22v-4a2 2 0 0 0-4 0v4"/><path d="M18 5v17"/><path d="M6 5v17"/><circle cx="12" cy="9" r="2"/></svg>`,
  layoutGrid: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>`,
  award: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>`,
};

export interface SubModuleItem {
  title: string;
  description: string;
  icon: string;
  path: string;
}

export interface SubModuleSection {
  title: string;
  items: SubModuleItem[];
}

export interface AdminModuleEntry {
  title: string;
  description: string;
  icon: string;
  path: string;
  moduleKey?: string;
  color: string;
  roles: string[];
  submodules?: SubModuleSection[];
}

export const ADMIN_MODULES_LIST: AdminModuleEntry[] = [
  {
    title: 'Matrículas',
    description: 'Gestión de solicitudes y aprobación de matrículas',
    icon: ICONS.fileText,
    path: '/app/admissions/applications',
    color: 'bg-[#1e293b]',
    roles: ['admin', 'director', 'secretary', 'coordinator']
  },
  {
    title: 'Asistencia',
    description: 'Supervisión de asistencia y justificaciones',
    icon: ICONS.calendarCheck,
    path: '/app/attendance/approvals',
    color: 'bg-[#1e293b]',
    roles: ['admin', 'director', 'secretary', 'coordinator']
  },
  {
    title: 'Evaluación',
    description: 'Notas y gestión de periodos',
    icon: ICONS.graduationCap,
    path: '/app/evaluation',
    moduleKey: 'evaluation',
    color: 'bg-[#1e293b]',
    roles: ['admin', 'director', 'coordinator'],
    submodules: [
      {
        title: 'Calificaciones',
        items: [
          {
            title: 'Registrar Notas',
            description: 'Ingreso de calificaciones por curso',
            icon: ICONS.graduationCap,
            path: '/app/evaluation/grade-entry'
          },
          {
            title: 'Gestión de Evaluaciones',
            description: 'Apertura y cierre de periodos',
            icon: ICONS.settings,
            path: '/app/evaluation/review'
          }
        ]
      }
    ]
  },
  {
    title: 'Tareas',
    description: 'Gestión de tareas y calificaciones',
    icon: ICONS.bookOpen,
    path: '/app/tasks',
    moduleKey: 'tasks',
    color: 'bg-[#1e293b]',
    roles: ['admin', 'director', 'coordinator', 'teacher'],
    submodules: [
      {
        title: 'Actividades',
        items: [
          {
            title: 'Gestión de Tareas',
            description: 'Crear, editar y eliminar tareas',
            icon: ICONS.bookOpen,
            path: '/app/tasks/management'
          },
          {
            title: 'Calificar Entregas',
            description: 'Revisar y calificar trabajos',
            icon: ICONS.checkCircle2,
            path: '/app/tasks/grading'
          }
        ]
      }
    ]
  },
  {
    title: 'Finanzas',
    description: 'Gestión de cobros, caja y reportes financieros',
    icon: ICONS.dollarSign,
    path: '/app/finance',
    moduleKey: 'finance',
    color: 'bg-[#1e293b]',
    roles: ['admin', 'director', 'finance'],
    submodules: [
      {
        title: 'Catálogo',
        items: [
          {
            title: 'Conceptos de Pago',
            description: 'Gestión de conceptos cobrables',
            icon: ICONS.tags,
            path: '/app/finance/catalog/concepts'
          },
          {
            title: 'Planes de Pago',
            description: 'Estructuras de pensiones y cuotas',
            icon: ICONS.fileText,
            path: '/app/finance/catalog/plans'
          },
          {
            title: 'Descuentos y Becas',
            description: 'Gestión de beneficios económicos',
            icon: ICONS.wallet,
            path: '/app/finance/catalog/discounts'
          }
        ]
      },
      {
        title: 'Gestión de Cargos',
        items: [
          {
            title: 'Emisión de Cargos',
            description: 'Generación masiva de deudas',
            icon: ICONS.creditCard,
            path: '/app/finance/charges/emission'
          },
          {
            title: 'Cuenta Corriente',
            description: 'Estado de cuenta por estudiante',
            icon: ICONS.users,
            path: '/app/finance/charges/student'
          }
        ]
      },
      {
        title: 'Caja y Tesorería',
        items: [
          {
            title: 'Caja Diaria',
            description: 'Registro de cobros y pagos',
            icon: ICONS.dollarSign,
            path: '/app/finance/cash'
          },
          {
            title: 'Cierres de Caja',
            description: 'Historial de cierres y arqueos',
            icon: ICONS.landmark,
            path: '/app/finance/cash/closures'
          }
        ]
      },
      {
        title: 'Reportes',
        items: [
          {
            title: 'Reportes Financieros',
            description: 'Indicadores y reportes de gestión',
            icon: ICONS.barChart3,
            path: '/app/finance/reports'
          }
        ]
      }
    ]
  },
  {
    title: 'Reportes',
    description: 'Reportes académicos y exportación SIAGIE',
    icon: ICONS.barChart3,
    path: '/app/reports/academic',
    color: 'bg-[#1e293b]',
    roles: ['admin', 'director', 'coordinator', 'teacher']
  },
  {
    title: 'Mensajería',
    description: 'Bandeja de mensajes y comunicados',
    icon: ICONS.messageSquare,
    path: '/app/messages',
    moduleKey: 'messages',
    color: 'bg-[#1e293b]',
    roles: ['admin', 'director', 'coordinator'],
    submodules: [
      {
        title: 'Gestión de Mensajes',
        items: [
          {
            title: 'Bandeja de Entrada',
            description: 'Mensajería directa con apoderados',
            icon: ICONS.messageSquare,
            path: '/app/messages/teacher'
          },
          {
            title: 'Gestionar Comunicados',
            description: 'Crear y editar avisos',
            icon: ICONS.megaphone,
            path: '/app/communications/teacher'
          },
          {
            title: 'Aprobar Comunicados',
            description: 'Revisión de anuncios institucionales',
            icon: ICONS.megaphone,
            path: '/app/communications/review'
          }
        ]
      }
    ]
  },
  {
    title: 'Configuración',
    description: 'Años académicos, grados y cursos',
    icon: ICONS.settings,
    path: '/app/settings',
    moduleKey: 'settings',
    color: 'bg-[#1e293b]',
    roles: ['admin', 'director'],
    submodules: [
      {
        title: 'Año Académico',
        items: [
          {
            title: 'Años Académicos',
            description: 'Gestión de años escolares (Apertura/Cierre)',
            icon: ICONS.calendar,
            path: '/app/settings/academic-years'
          },
          {
            title: 'Periodos',
            description: 'Trimestres, bimestres o semestres',
            icon: ICONS.clock,
            path: '/app/settings/periods'
          }
        ]
      },
      {
        title: 'Estructura Institucional',
        items: [
          {
            title: 'Grados y Niveles',
            description: 'Configuración de niveles educativos',
            icon: ICONS.school,
            path: '/app/settings/grades'
          },
          {
            title: 'Secciones',
            description: 'Gestión de aulas y turnos',
            icon: ICONS.layoutGrid,
            path: '/app/settings/sections'
          }
        ]
      },
      {
        title: 'Gestión Académica',
        items: [
          {
            title: 'Cursos',
            description: 'Catálogo de asignaturas',
            icon: ICONS.bookOpen,
            path: '/app/settings/courses'
          },
          {
            title: 'Competencias',
            description: 'Capacidades y criterios de evaluación',
            icon: ICONS.award,
            path: '/app/settings/competencies'
          },
          {
            title: 'Asignación Docente',
            description: 'Carga académica por profesor',
            icon: ICONS.graduationCap,
            path: '/app/settings/teacher-assignments'
          }
        ]
      },
      {
        title: 'Gestión Administrativa',
        items: [
          {
            title: 'Usuarios',
            description: 'Administradores, directores y personal',
            icon: ICONS.settings,
            path: '/app/settings/users'
          },
          {
            title: 'Estudiantes',
            description: 'Directorio general de alumnos',
            icon: ICONS.users,
            path: '/app/settings/students'
          },
          {
            title: 'Config. Matrículas',
            description: 'Parámetros del proceso de admisión',
            icon: ICONS.fileText,
            path: '/app/settings/enrollments'
          }
        ]
      }
    ]
  },
  {
    title: 'Usuarios',
    description: 'Gestión de cuentas y permisos',
    icon: ICONS.users,
    path: '/app/settings/users',
    color: 'bg-[#1e293b]',
    roles: ['admin', 'director']
  },
  {
    title: 'Métricas',
    description: 'KPIs y estadísticas generales',
    icon: ICONS.activity,
    path: '/app/dashboard/metrics/admin',
    color: 'bg-[#1e293b]',
    roles: ['admin', 'director']
  },
  {
    title: 'Horarios',
    description: 'Gestión de horarios de clases',
    icon: ICONS.clock,
    path: '/app/schedule/admin',
    color: 'bg-[#1e293b]',
    roles: ['admin', 'director', 'coordinator']
  },
  {
    title: 'Sitio Web',
    description: 'Gestión de noticias y contenido público',
    icon: ICONS.newspaper,
    path: '/app/settings/news',
    moduleKey: 'website',
    color: 'bg-[#1e293b]',
    roles: ['admin', 'director', 'web_editor'],
    submodules: [
      {
        title: 'Contenido Público',
        items: [
          {
            title: 'Noticias y Eventos',
            description: 'Gestionar noticias de la página pública',
            icon: ICONS.newspaper,
            path: '/app/settings/news'
          }
        ]
      }
    ]
  }
];
