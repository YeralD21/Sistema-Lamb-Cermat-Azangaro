import { Routes } from '@angular/router';
import { roleGuard } from './core/guards/role.guard';

export const PRIVATE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./shared/components/private-layout/private-layout.component').then(m => m.PrivateLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      // ── Admin Dashboard ──────────────────────────────────
      {
        path: 'dashboard',
        loadComponent: () => import('./features/admin/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
        title: 'CERMAT - Panel de Administración'
      },

      // ── Matrículas ───────────────────────────────────────
      {
        path: 'admissions/applications',
        loadComponent: () => import('./features/admissions/enrollment-approvals/enrollment-approvals.component').then(m => m.EnrollmentApprovalsComponent),
        title: 'CERMAT - Solicitudes de Matrícula'
      },

      // ── Asistencia ───────────────────────────────────────
      {
        path: 'attendance/approvals',
        loadComponent: () => import('./features/attendance/attendance-approvals/attendance-approvals.component').then(m => m.AttendanceApprovalsComponent),
        title: 'CERMAT - Aprobación de Justificaciones'
      },

      // ── Reportes ─────────────────────────────────────────
      {
        path: 'reports/academic',
        loadComponent: () => import('./features/reports/academic-reports/academic-reports.component').then(m => m.AcademicReportsComponent),
        title: 'CERMAT - Reportes Académicos'
      },

      // ── Usuarios ─────────────────────────────────────────
      {
        path: 'settings/users',
        loadComponent: () => import('./features/users/admin-users/admin-users.component').then(m => m.AdminUsersComponent),
        title: 'CERMAT - Gestión de Usuarios'
      },

      // ── Métricas ─────────────────────────────────────────
      {
        path: 'dashboard/metrics/admin',
        loadComponent: () => import('./features/metrics/admin-metrics/admin-metrics.component').then(m => m.AdminMetricsComponent),
        title: 'CERMAT - Métricas del Sistema'
      },

      // ── Horarios ─────────────────────────────────────────
      {
        path: 'schedule/admin',
        loadComponent: () => import('./features/schedule/admin-schedule/admin-schedule.component').then(m => m.AdminScheduleComponent),
        title: 'CERMAT - Gestión de Horarios'
      },
      
      // ── Evaluación ───────────────────────────────────────
      {
        path: 'evaluation/grade-entry',
        loadComponent: () => import('./features/evaluation/grade-entry/grade-entry.component').then(m => m.GradeEntryComponent),
        title: 'CERMAT - Registro de Notas'
      },
      {
        path: 'evaluation/review',
        loadComponent: () => import('./features/evaluation/evaluation-review/evaluation-review.component').then(m => m.EvaluationReviewComponent),
        title: 'CERMAT - Gestión de Evaluaciones'
      },

      // ── Tareas ───────────────────────────────────────────
      {
        path: 'tasks/management',
        loadComponent: () => import('./features/tasks/task-management/task-management.component').then(m => m.TaskManagementComponent),
        title: 'CERMAT - Gestión de Tareas'
      },
      {
        path: 'tasks/grading',
        loadComponent: () => import('./features/tasks/task-grading/task-grading.component').then(m => m.TaskGradingComponent),
        title: 'CERMAT - Calificar Entregas'
      },

      // ── Finanzas ─────────────────────────────────────────
      {
        path: 'finance/catalog/concepts',
        loadComponent: () => import('./features/finance/catalog/finance-concepts.component').then(m => m.FinanceConceptsComponent),
        title: 'CERMAT - Conceptos de Pago'
      },
      {
        path: 'finance/catalog/plans',
        loadComponent: () => import('./features/finance/catalog/finance-plans.component').then(m => m.FinancePlansComponent),
        title: 'CERMAT - Planes de Pago'
      },
      {
        path: 'finance/catalog/discounts',
        loadComponent: () => import('./features/finance/catalog/finance-discounts.component').then(m => m.FinanceDiscountsComponent),
        title: 'CERMAT - Descuentos y Becas'
      },
      {
        path: 'finance/charges/emission',
        loadComponent: () => import('./features/finance/charges/finance-emission.component').then(m => m.FinanceEmissionComponent),
        title: 'CERMAT - Emisión de Cargos'
      },
      {
        path: 'finance/charges/student',
        loadComponent: () => import('./features/finance/charges/finance-student.component').then(m => m.FinanceStudentComponent),
        title: 'CERMAT - Cuenta Estudiante'
      },
      {
        path: 'finance/cash',
        loadComponent: () => import('./features/finance/cash/finance-cash.component').then(m => m.FinanceCashComponent),
        title: 'CERMAT - Caja Diaria'
      },
      {
        path: 'finance/cash/closures',
        loadComponent: () => import('./features/finance/cash/finance-closures.component').then(m => m.FinanceClosuresComponent),
        title: 'CERMAT - Historial de Cierres'
      },
      {
        path: 'finance/reports',
        loadComponent: () => import('./features/finance/reports/finance-reports.component').then(m => m.FinanceReportsComponent),
        title: 'CERMAT - Reportes Financieros'
      },

      // ── Mensajería y Comunicados ──────────────────────────
      {
        path: 'messages/teacher',
        loadComponent: () => import('./features/messaging/messaging-inbox.component').then(m => m.MessagingInboxComponent),
        title: 'CERMAT - Bandeja de Entrada'
      },
      {
        path: 'communications/teacher',
        loadComponent: () => import('./features/communications/communications-management.component').then(m => m.CommunicationsManagementComponent),
        title: 'CERMAT - Gestionar Comunicados'
      },
      {
        path: 'communications/review',
        loadComponent: () => import('./features/communications/communications-approval.component').then(m => m.CommunicationsApprovalComponent),
        title: 'CERMAT - Aprobar Comunicados'
      },

      // ── Configuración / Ajustes ──────────────────────────
      {
        path: 'settings/academic-years',
        loadComponent: () => import('./features/settings/academic-years.component').then(m => m.AcademicYearsComponent),
        title: 'CERMAT - Años Académicos'
      },
      {
        path: 'settings/periods',
        loadComponent: () => import('./features/settings/periods.component').then(m => m.PeriodsComponent),
        title: 'CERMAT - Periodos'
      },
      {
        path: 'settings/grades',
        loadComponent: () => import('./features/settings/grades-levels.component').then(m => m.GradesLevelsComponent),
        title: 'CERMAT - Grados y Niveles'
      },
      {
        path: 'settings/sections',
        loadComponent: () => import('./features/settings/sections.component').then(m => m.SectionsComponent),
        title: 'CERMAT - Secciones'
      },
      {
        path: 'settings/courses',
        loadComponent: () => import('./features/settings/courses.component').then(m => m.CoursesComponent),
        title: 'CERMAT - Cursos'
      },
      {
        path: 'settings/competencies',
        loadComponent: () => import('./features/settings/competencies.component').then(m => m.CompetenciesComponent),
        title: 'CERMAT - Competencias'
      },
      {
        path: 'settings/teacher-assignments',
        loadComponent: () => import('./features/settings/teacher-assignments.component').then(m => m.TeacherAssignmentsComponent),
        title: 'CERMAT - Asignación Docente'
      },
      {
        path: 'settings/users',
        loadComponent: () => import('./features/settings/admin-users.component').then(m => m.AdminUsersComponent),
        title: 'CERMAT - Usuarios'
      },
      {
        path: 'settings/students',
        loadComponent: () => import('./features/settings/students.component').then(m => m.StudentsComponent),
        title: 'CERMAT - Estudiantes'
      },
      {
        path: 'settings/enrollments',
        loadComponent: () => import('./features/settings/enrollment-config.component').then(m => m.EnrollmentConfigComponent),
        title: 'CERMAT - Configuración Matrículas'
      },
      // ── Sitio Web ───────────────────────────────────────
      {
        path: 'settings/news',
        loadComponent: () => import('./features/website/news-management.component').then(m => m.NewsManagementComponent),
        title: 'CERMAT - Gestión de Noticias y Eventos'
      }
    ]
  }
];
