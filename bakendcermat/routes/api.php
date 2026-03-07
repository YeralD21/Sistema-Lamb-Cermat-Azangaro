<?php

use Illuminate\Support\Facades\Route;

// Auth
use App\Http\Controllers\Api\AuthController;

// Académico
use App\Http\Controllers\Api\AcademicYearController;
use App\Http\Controllers\Api\GradeLevelController;
use App\Http\Controllers\Api\SectionController;
use App\Http\Controllers\Api\PeriodController;
use App\Http\Controllers\Api\CourseController;
use App\Http\Controllers\Api\CourseAssignmentController;
use App\Http\Controllers\Api\CourseScheduleController;
use App\Http\Controllers\Api\CompetencyController;
use App\Http\Controllers\Api\EvaluationController;
use App\Http\Controllers\Api\ReportController;

// Personas
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\StudentController;
use App\Http\Controllers\Api\TeacherController;
use App\Http\Controllers\Api\GuardianController;
use App\Http\Controllers\Api\StudentGuardianController;

// Matrículas
use App\Http\Controllers\Api\EnrollmentApplicationController;
use App\Http\Controllers\Api\TeacherCourseAssignmentController;
use App\Http\Controllers\Api\StudentCourseEnrollmentController;

// Tareas / Entregas
use App\Http\Controllers\Api\AssignmentController;
use App\Http\Controllers\Api\TaskSubmissionController;
use App\Http\Controllers\Api\AssignmentSubmissionController;

// Asistencia
use App\Http\Controllers\Api\AttendanceController;
use App\Http\Controllers\Api\AttendanceJustificationController;

// Comunicación
use App\Http\Controllers\Api\AnnouncementController;
use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\PublicNewsController;

// Finanzas
use App\Http\Controllers\Api\FeeConceptController;
use App\Http\Controllers\Api\ChargeController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\ReceiptController;
use App\Http\Controllers\Api\DiscountController;
use App\Http\Controllers\Api\StudentDiscountController;
use App\Http\Controllers\Api\FinancialPlanController;
use App\Http\Controllers\Api\PlanInstallmentController;
use App\Http\Controllers\Api\CashClosureController;

// Auditoría
use App\Http\Controllers\Api\AuditLogController;

/*
|--------------------------------------------------------------------------
| API PÚBLICA
|--------------------------------------------------------------------------
| Rutas sin autenticación.
| Usadas principalmente para login o recursos públicos.
|--------------------------------------------------------------------------
*/

Route::post('/login', [AuthController::class, 'login']);

/*
|--------------------------------------------------------------------------
| API PROTEGIDA
|--------------------------------------------------------------------------
| Todas las rutas dentro de este grupo requieren token Sanctum.
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {

    /*
    |--------------------------------------------------------------------------
    | AUTENTICACIÓN / SESIÓN
    |--------------------------------------------------------------------------
    | Endpoints para usuario autenticado.
    | El frontend suele consumir /me al iniciar la app.
    |--------------------------------------------------------------------------
    */
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    /*
    |--------------------------------------------------------------------------
    | DASHBOARD
    |--------------------------------------------------------------------------
    | Resumen general del sistema para roles administrativos.
    |--------------------------------------------------------------------------
    */
    Route::get('/dashboard', [ReportController::class, 'dashboard'])
        ->middleware('role:admin,director,coordinator,secretary');

    /*
    |--------------------------------------------------------------------------
    | MÓDULO: ACADÉMICO - Catálogos base
    |--------------------------------------------------------------------------
    | Catálogos usados por el sistema académico:
    | - años académicos
    | - grados
    | - secciones
    | - periodos
    | - cursos
    |--------------------------------------------------------------------------
    */
    Route::middleware('role:admin,director,coordinator,secretary')->group(function () {
        Route::apiResource('academic-years', AcademicYearController::class);
        Route::apiResource('grade-levels', GradeLevelController::class);
        Route::apiResource('sections', SectionController::class);
        Route::apiResource('periods', PeriodController::class);
        Route::apiResource('courses', CourseController::class);
    });

    /*
    |--------------------------------------------------------------------------
    | MÓDULO: PERSONAS
    |--------------------------------------------------------------------------
    | Gestión de perfiles y personas del sistema:
    | - perfiles
    | - estudiantes
    | - docentes
    | - apoderados
    | - relación estudiante/apoderado
    |--------------------------------------------------------------------------
    */
    Route::middleware('role:admin,director,coordinator,secretary')->group(function () {
        Route::apiResource('profiles', ProfileController::class);
        Route::apiResource('students', StudentController::class);
        Route::apiResource('teachers', TeacherController::class);
        Route::apiResource('guardians', GuardianController::class);
        Route::apiResource('student-guardians', StudentGuardianController::class);
    });

    /*
    |--------------------------------------------------------------------------
    | MÓDULO: HORARIOS Y ASIGNACIONES
    |--------------------------------------------------------------------------
    | Gestión de horarios y asignación de cursos.
    |--------------------------------------------------------------------------
    */

    // Horarios de cursos - lectura para la mayoría de roles autenticados
    Route::get('course-schedules', [CourseScheduleController::class, 'index'])
        ->middleware('role:admin,director,coordinator,secretary,teacher,student,guardian');
    Route::get('course-schedules/{courseSchedule}', [CourseScheduleController::class, 'show'])
        ->middleware('role:admin,director,coordinator,secretary,teacher,student,guardian');

    // Horarios de cursos - escritura para administración y docentes
    Route::middleware('role:admin,director,coordinator,secretary,teacher')->group(function () {
        Route::post('course-schedules', [CourseScheduleController::class, 'store']);
        Route::put('course-schedules/{courseSchedule}', [CourseScheduleController::class, 'update']);
        Route::delete('course-schedules/{courseSchedule}', [CourseScheduleController::class, 'destroy']);
    });

    // Asignaciones de cursos - lectura
    Route::get('course-assignments', [CourseAssignmentController::class, 'index'])
        ->middleware('role:admin,director,coordinator,secretary,teacher');
    Route::get('course-assignments/{courseAssignment}', [CourseAssignmentController::class, 'show'])
        ->middleware('role:admin,director,coordinator,secretary,teacher');

    // Asignaciones de cursos - escritura
    Route::middleware('role:admin,director,coordinator,secretary')->group(function () {
        Route::post('course-assignments', [CourseAssignmentController::class, 'store']);
        Route::put('course-assignments/{courseAssignment}', [CourseAssignmentController::class, 'update']);
        Route::delete('course-assignments/{courseAssignment}', [CourseAssignmentController::class, 'destroy']);
    });

    /*
    |--------------------------------------------------------------------------
    | MÓDULO: MATRÍCULAS
    |--------------------------------------------------------------------------
    | Gestión de:
    | - postulaciones
    | - asignación docente-curso
    | - matrículas del estudiante en cursos
    |--------------------------------------------------------------------------
    */
    Route::middleware('role:admin,director,coordinator,secretary')->group(function () {
        Route::apiResource('enrollment-applications', EnrollmentApplicationController::class);
        Route::post('enrollment-applications/{id}/approve', [EnrollmentApplicationController::class, 'approve']);
        Route::post('enrollment-applications/{id}/reject', [EnrollmentApplicationController::class, 'reject']);

        Route::apiResource('teacher-course-assignments', TeacherCourseAssignmentController::class);

        Route::apiResource('student-course-enrollments', StudentCourseEnrollmentController::class)
            ->only(['index', 'show', 'update']);
    });

    /*
    |--------------------------------------------------------------------------
    | MÓDULO: TAREAS
    |--------------------------------------------------------------------------
    | Gestión de tareas publicadas por docentes/administración.
    |--------------------------------------------------------------------------
    */

    // Lectura de tareas
    Route::get('assignments', [AssignmentController::class, 'index'])
        ->middleware('role:admin,director,coordinator,secretary,teacher,student,guardian');
    Route::get('assignments/{assignment}', [AssignmentController::class, 'show'])
        ->middleware('role:admin,director,coordinator,secretary,teacher,student,guardian');

    // Escritura de tareas
    Route::post('assignments', [AssignmentController::class, 'store'])
        ->middleware('role:admin,director,coordinator,secretary,teacher');
    Route::put('assignments/{assignment}', [AssignmentController::class, 'update'])
        ->middleware('role:admin,director,coordinator,secretary,teacher');
    Route::delete('assignments/{assignment}', [AssignmentController::class, 'destroy'])
        ->middleware('role:admin,director,coordinator,secretary');

    /*
    |--------------------------------------------------------------------------
    | MÓDULO: ENTREGA DE TAREAS (task-submissions)
    |--------------------------------------------------------------------------
    | Entregas de tareas realizadas por alumnos.
    |--------------------------------------------------------------------------
    */
    Route::get('task-submissions', [TaskSubmissionController::class, 'index'])
        ->middleware('role:admin,director,coordinator,secretary,teacher,student');
    Route::get('task-submissions/{taskSubmission}', [TaskSubmissionController::class, 'show'])
        ->middleware('role:admin,director,coordinator,secretary,teacher,student');

    Route::post('task-submissions', [TaskSubmissionController::class, 'store'])
        ->middleware('role:admin,student');
    Route::put('task-submissions/{taskSubmission}', [TaskSubmissionController::class, 'update'])
        ->middleware('role:admin,student');
    Route::post('task-submissions/{taskSubmission}/grade', [TaskSubmissionController::class, 'grade'])
        ->middleware('role:admin,teacher');
    Route::delete('task-submissions/{taskSubmission}', [TaskSubmissionController::class, 'destroy'])
        ->middleware('role:admin');

    /*
    |--------------------------------------------------------------------------
    | MÓDULO: ASSIGNMENT SUBMISSIONS
    |--------------------------------------------------------------------------
    | Otro módulo de entregas/revisión asociado a assignments.
    |--------------------------------------------------------------------------
    */
    Route::get('assignment-submissions', [AssignmentSubmissionController::class, 'index'])
        ->middleware('role:admin,director,coordinator,secretary,teacher,student');
    Route::get('assignment-submissions/{assignmentSubmission}', [AssignmentSubmissionController::class, 'show'])
        ->middleware('role:admin,director,coordinator,secretary,teacher,student');
    Route::post('assignment-submissions', [AssignmentSubmissionController::class, 'store'])
        ->middleware('role:admin,student');
    Route::put('assignment-submissions/{assignmentSubmission}', [AssignmentSubmissionController::class, 'update'])
        ->middleware('role:admin,student');
    Route::delete('assignment-submissions/{assignmentSubmission}', [AssignmentSubmissionController::class, 'destroy'])
        ->middleware('role:admin');
    Route::post('assignment-submissions/{assignmentSubmission}/review', [AssignmentSubmissionController::class, 'review'])
        ->middleware('role:admin,teacher');

    /*
    |--------------------------------------------------------------------------
    | MÓDULO: ASISTENCIA
    |--------------------------------------------------------------------------
    | Registro y mantenimiento de asistencia.
    |--------------------------------------------------------------------------
    */
    Route::get('attendance', [AttendanceController::class, 'index'])
        ->middleware('role:admin,director,coordinator,secretary,teacher');
    Route::post('attendance', [AttendanceController::class, 'store'])
        ->middleware('role:admin,director,coordinator,secretary,teacher');
    Route::get('attendance/{attendance}', [AttendanceController::class, 'show'])
        ->middleware('role:admin,director,coordinator,secretary,teacher');
    Route::put('attendance/{attendance}', [AttendanceController::class, 'update'])
        ->middleware('role:admin,director,coordinator,secretary,teacher');
    Route::delete('attendance/{attendance}', [AttendanceController::class, 'destroy'])
        ->middleware('role:admin,director,coordinator,secretary');

    /*
    |--------------------------------------------------------------------------
    | MÓDULO: JUSTIFICACIONES DE ASISTENCIA
    |--------------------------------------------------------------------------
    | Solicitudes y revisión de justificaciones.
    |--------------------------------------------------------------------------
    */
    Route::get('attendance-justifications', [AttendanceJustificationController::class, 'index'])
        ->middleware('role:admin,director,coordinator,secretary,teacher,guardian');
    Route::post('attendance-justifications', [AttendanceJustificationController::class, 'store'])
        ->middleware('role:admin,guardian');
    Route::get('attendance-justifications/{attendanceJustification}', [AttendanceJustificationController::class, 'show'])
        ->middleware('role:admin,director,coordinator,secretary,teacher,guardian');
    Route::post('attendance-justifications/{attendanceJustification}/approve', [AttendanceJustificationController::class, 'approve'])
        ->middleware('role:admin,director,coordinator,secretary,teacher');
    Route::post('attendance-justifications/{attendanceJustification}/reject', [AttendanceJustificationController::class, 'reject'])
        ->middleware('role:admin,director,coordinator,secretary,teacher');
    Route::delete('attendance-justifications/{attendanceJustification}', [AttendanceJustificationController::class, 'destroy'])
        ->middleware('role:admin');

    /*
    |--------------------------------------------------------------------------
    | MÓDULO: COMPETENCIAS
    |--------------------------------------------------------------------------
    | Catálogo de competencias académicas.
    |--------------------------------------------------------------------------
    */
    Route::middleware('role:admin,director,coordinator,secretary,teacher')->group(function () {
        Route::apiResource('competencies', CompetencyController::class);
    });

    /*
    |--------------------------------------------------------------------------
    | MÓDULO: EVALUACIONES / NOTAS
    |--------------------------------------------------------------------------
    | Registro, actualización y publicación de evaluaciones.
    |--------------------------------------------------------------------------
    */
    Route::middleware('role:admin,director,coordinator,secretary,teacher')->group(function () {
        Route::get('evaluations', [EvaluationController::class, 'index']);
        Route::post('evaluations', [EvaluationController::class, 'store']);
        Route::get('evaluations/{evaluation}', [EvaluationController::class, 'show']);
        Route::put('evaluations/{evaluation}', [EvaluationController::class, 'update']);
        Route::delete('evaluations/{evaluation}', [EvaluationController::class, 'destroy']);

        Route::post('evaluations/{evaluation}/publish', [EvaluationController::class, 'publish']);
        Route::post('evaluations/{evaluation}/close', [EvaluationController::class, 'close']);
    });

    /*
    |--------------------------------------------------------------------------
    | MÓDULO: REPORTES
    |--------------------------------------------------------------------------
    | Reportes por estudiante:
    | - boleta de notas
    | - asistencia
    | - resumen financiero
    |--------------------------------------------------------------------------
    */
    Route::middleware('role:admin,director,coordinator,secretary,teacher,student,guardian')->group(function () {
        Route::get('reports/students/{student}/report-card', [ReportController::class, 'reportCard'])
            ->middleware('student.guardian.access');

        Route::get('reports/students/{student}/attendance', [ReportController::class, 'attendanceSummary'])
            ->middleware('student.guardian.access');

        Route::get('reports/students/{student}/financial', [ReportController::class, 'financialSummary'])
            ->middleware('student.guardian.access');
    });

    /*
    |--------------------------------------------------------------------------
    | MÓDULO: ANUNCIOS
    |--------------------------------------------------------------------------
    | Publicación y flujo de aprobación de anuncios internos.
    |--------------------------------------------------------------------------
    */
    Route::apiResource('announcements', AnnouncementController::class);

    Route::post('announcements/{announcement}/request-approval', [AnnouncementController::class, 'requestApproval']);
    Route::post('announcements/{announcement}/approve', [AnnouncementController::class, 'approve']);
    Route::post('announcements/{announcement}/archive', [AnnouncementController::class, 'archive']);

    /*
    |--------------------------------------------------------------------------
    | MÓDULO: MENSAJES
    |--------------------------------------------------------------------------
    | Mensajería interna entre usuarios autorizados.
    |--------------------------------------------------------------------------
    */
    Route::middleware('role:admin,director,coordinator,secretary,teacher,guardian')->group(function () {
        Route::apiResource('messages', MessageController::class)
            ->only(['index', 'store', 'show', 'update', 'destroy']);
    });

    /*
    |--------------------------------------------------------------------------
    | MÓDULO: NOTIFICACIONES
    |--------------------------------------------------------------------------
    | Listado, detalle, borrado y marcado de notificaciones.
    |--------------------------------------------------------------------------
    */
    Route::get('notifications', [NotificationController::class, 'index']);
    Route::get('notifications/{notification}', [NotificationController::class, 'show']);
    Route::delete('notifications/{notification}', [NotificationController::class, 'destroy']);
    Route::put('notifications/{notification}/read', [NotificationController::class, 'markAsRead']);
    Route::put('notifications/read-all', [NotificationController::class, 'markAllAsRead']);

    Route::post('notifications', [NotificationController::class, 'store'])
        ->middleware('role:admin,director,coordinator,secretary');

    /*
    |--------------------------------------------------------------------------
    | MÓDULO: NOTICIAS PÚBLICAS
    |--------------------------------------------------------------------------
    | Gestión de noticias visibles públicamente.
    |--------------------------------------------------------------------------
    */
    Route::middleware('role:admin,director,coordinator,secretary')->group(function () {
        Route::apiResource('public-news', PublicNewsController::class);
    });

    /*
    |--------------------------------------------------------------------------
    | MÓDULO: FINANZAS
    |--------------------------------------------------------------------------
    | Conceptos, cobros, pagos y recibos.
    |--------------------------------------------------------------------------
    */
    Route::middleware('role:admin,director,coordinator,secretary')->group(function () {
        Route::apiResource('fee-concepts', FeeConceptController::class);
        Route::apiResource('charges', ChargeController::class);
        Route::apiResource('payments', PaymentController::class)->only(['index', 'store', 'show', 'destroy']);
        Route::apiResource('receipts', ReceiptController::class)->only(['index', 'store', 'show', 'destroy']);
    });

    /*
    |--------------------------------------------------------------------------
    | MÓDULO: DESCUENTOS / PLANES / CAJA
    |--------------------------------------------------------------------------
    | Descuentos, planes financieros, cuotas y cierres de caja.
    |--------------------------------------------------------------------------
    */
    Route::middleware('role:admin,director,coordinator,secretary')->group(function () {
        Route::apiResource('discounts', DiscountController::class);
        Route::apiResource('student-discounts', StudentDiscountController::class);
        Route::apiResource('financial-plans', FinancialPlanController::class);
        Route::apiResource('plan-installments', PlanInstallmentController::class);
        Route::apiResource('cash-closures', CashClosureController::class);
    });

    /*
    |--------------------------------------------------------------------------
    | MÓDULO: AUDITORÍA
    |--------------------------------------------------------------------------
    | Consulta de logs del sistema.
    |--------------------------------------------------------------------------
    */
    Route::middleware('role:admin,director')->group(function () {
        Route::get('audit-logs', [AuditLogController::class, 'index']);
        Route::get('audit-logs/{auditLog}', [AuditLogController::class, 'show']);
    });
});
