// SVG icon strings for student modules
const ICONS = {
  calendar: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>`,
  graduationCap: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`,
  bookOpen: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`,
  messageSquare: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
  activity: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`,
  clock: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
};

export interface StudentModuleEntry {
  title: string;
  description: string;
  icon: string;
  path: string;
}

export const STUDENT_MODULES_LIST: StudentModuleEntry[] = [
  {
    title: 'Asistencia',
    description: 'Consulta tu récord de asistencia diario',
    icon: ICONS.calendar,
    path: '/app/attendance/student'
  },
  {
    title: 'Mis Notas',
    description: 'Visualiza tus calificaciones y promedios',
    icon: ICONS.graduationCap,
    path: '/app/evaluation/student'
  },
  {
    title: 'Tareas',
    description: 'Gestiona tus actividades y entregas',
    icon: ICONS.bookOpen,
    path: '/app/tasks/student'
  },
  {
    title: 'Comunicados',
    description: 'Avisos y mensajes institucionales',
    icon: ICONS.messageSquare,
    path: '/app/communications/student'
  },
  {
    title: 'Mi Progreso',
    description: 'Estadísticas de tu rendimiento académico',
    icon: ICONS.activity,
    path: '/app/dashboard/metrics/student'
  },
  {
    title: 'Mi Horario',
    description: 'Consulta tu programación de clases',
    icon: ICONS.clock,
    path: '/app/schedule/my'
  }
];
