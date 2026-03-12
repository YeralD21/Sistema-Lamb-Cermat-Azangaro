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
      }
    ]
  }
];
