<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\StudentCourseEnrollment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class ReportController extends Controller
{
    /**
     * BOLETA / REPORTE DE NOTAS
     * GET /api/reports/students/{student}/report-card?period_id=UUID
     */
    public function reportCard(Student $student, Request $request)
    {
        $periodId = $request->query('period_id');
        $role = $request->user()?->profile?->role;
        $commentsColumn = Schema::hasColumn('evaluations', 'observations') ? 'observations' : 'comments';
        $competencyLabelColumn = Schema::hasColumn('competencies', 'name') ? 'name' : 'description';
        $academicYearId = $periodId
            ? DB::table('periods')->where('id', $periodId)->value('academic_year_id')
            : DB::table('academic_years')->where('is_active', true)->value('id');

        $q = DB::table('evaluations as e')
            ->join('courses as c', 'c.id', '=', 'e.course_id')
            ->join('competencies as comp', 'comp.id', '=', 'e.competency_id')
            ->join('periods as p', 'p.id', '=', 'e.period_id')
            ->select([
                'e.id',
                'e.student_id',
                'e.course_id',
                'c.name as course_name',
                'c.code as course_code',
                'e.competency_id',
                DB::raw("COALESCE(comp.{$competencyLabelColumn}, '') as competency_name"),
                'e.period_id',
                'p.name as period_name',
                'e.grade',
                'e.status',
                DB::raw("COALESCE(e.{$commentsColumn},'') as comments"),
                'e.created_at',
            ])
            ->where('e.student_id', $student->id);

        if (in_array($role, ['student', 'guardian'], true)) {
            $q->whereIn('e.status', ['publicada', 'cerrada']);
        }

        if ($periodId) {
            $q->where('e.period_id', $periodId);
        }

        $rows = $q->orderBy('c.name')
            ->orderBy("comp.{$competencyLabelColumn}")
            ->get();

        // Agrupar: Curso -> Competencias
        $grouped = [];
        $enrolledCourses = StudentCourseEnrollment::query()
            ->with('course')
            ->where('student_id', $student->id)
            ->where('status', 'active')
            ->when($academicYearId, fn ($query) => $query->where('academic_year_id', $academicYearId))
            ->get()
            ->filter(fn (StudentCourseEnrollment $enrollment) => $enrollment->course)
            ->unique('course_id')
            ->sortBy(fn (StudentCourseEnrollment $enrollment) => $enrollment->course?->name ?? '')
            ->values();

        foreach ($enrolledCourses as $enrollment) {
            $grouped[$enrollment->course_id] = [
                'course_id' => $enrollment->course->id,
                'course_name' => $enrollment->course->name,
                'course_code' => $enrollment->course->code,
                'period_id' => $periodId,
                'period_name' => null,
                'competencies' => [],
            ];
        }

        foreach ($rows as $r) {
            $courseKey = $r->course_id;
            if (!isset($grouped[$courseKey])) {
                $grouped[$courseKey] = [
                    'course_id' => $r->course_id,
                    'course_name' => $r->course_name,
                    'course_code' => $r->course_code,
                    'period_id' => $r->period_id,
                    'period_name' => $r->period_name,
                    'competencies' => [],
                ];
            }

            $grouped[$courseKey]['competencies'][] = [
                'evaluation_id' => $r->id,
                'competency_id' => $r->competency_id,
                'competency_name' => $r->competency_name,
                'grade' => $r->grade,          // enum: AD/A/B/C
                'status' => $r->status,        // borrador/publicada/cerrada
                'comments' => $r->comments,
            ];
        }

        return response()->json([
            'student' => [
                'id' => $student->id,
                'full_name' => $student->full_name ?? null,
                'dni' => $student->dni ?? null,
                'student_code' => $student->student_code ?? null,
            ],
            'filters' => [
                'period_id' => $periodId,
            ],
            'report' => array_values($grouped),
        ]);
    }

    /**
     * RESUMEN ASISTENCIA
     * GET /api/reports/students/{student}/attendance?date_from=YYYY-MM-DD&date_to=YYYY-MM-DD
     */
    public function attendanceSummary(Student $student, Request $request)
    {
        $dateFrom = $request->query('date_from');
        $dateTo = $request->query('date_to');

        $q = DB::table('attendance')
            ->where('attendance.student_id', $student->id);

        if ($dateFrom) $q->whereDate('attendance.date', '>=', $dateFrom);
        if ($dateTo) $q->whereDate('attendance.date', '<=', $dateTo);

        // Conteo por estado (presente/tarde/falta/justificado)
        $counts = (clone $q)
            ->select('attendance.status', DB::raw('COUNT(*)::int as total'))
            ->groupBy('attendance.status')
            ->orderBy('attendance.status')
            ->get();

        // últimos registros
        $records = (clone $q)
            ->leftJoin('courses', 'courses.id', '=', 'attendance.course_id')
            ->leftJoin('attendance_justifications as aj', 'aj.attendance_id', '=', 'attendance.id')
            ->select([
                'attendance.id',
                'attendance.date',
                'attendance.status',
                'attendance.justification',
                'attendance.course_id',
                DB::raw("COALESCE(courses.name, '') as course_name"),
                DB::raw("COALESCE(courses.code, '') as course_code"),
                DB::raw("case when aj.id is null then null else json_build_object(
                    'id', aj.id,
                    'status', aj.status,
                    'reason', aj.reason,
                    'review_notes', aj.review_notes,
                    'reviewed_at', aj.reviewed_at
                ) end as justification_data"),
            ])
            ->orderByDesc('attendance.date')
            ->orderByDesc('attendance.updated_at')
            ->get();

        return response()->json([
            'student_id' => $student->id,
            'filters' => [
                'date_from' => $dateFrom,
                'date_to' => $dateTo,
            ],
            'counts_by_status' => $counts,
            'records' => $records,
            'recent' => $records->take(30)->values(),
        ]);
    }

    /**
     * RESUMEN FINANCIERO (CARGOS/PAGOS)
     * GET /api/reports/students/{student}/financial?academic_year_id=UUID
     */
    public function financialSummary(Student $student, Request $request)
    {
        $yearId = $request->query('academic_year_id');

        $q = DB::table('charges as ch')
            ->leftJoin('fee_concepts as fc', 'fc.id', '=', 'ch.concept_id')
            ->select([
                'ch.id',
                'ch.student_id',
                'ch.academic_year_id',
                'ch.concept_id',
                DB::raw("COALESCE(fc.name,'') as concept_name"),
                'ch.type',
                'ch.status',
                'ch.amount',
                DB::raw("COALESCE(ch.discount_amount,0) as discount_amount"),
                DB::raw("COALESCE(ch.paid_amount,0) as paid_amount"),
                'ch.due_date',
                DB::raw("COALESCE(ch.notes,'') as notes"),
                'ch.created_at',
            ])
            ->where('ch.student_id', $student->id);

        if ($yearId) {
            $q->where('ch.academic_year_id', $yearId);
        }

        $charges = $q->orderByDesc('ch.due_date')->orderByDesc('ch.created_at')->get();

        // Totales
        $total = 0.0;
        $discount = 0.0;
        $paid = 0.0;

        foreach ($charges as $c) {
            $total += (float) $c->amount;
            $discount += (float) $c->discount_amount;
            $paid += (float) $c->paid_amount;
        }

        $net = max(0, $total - $discount);
        $pending = max(0, $net - $paid);

        return response()->json([
            'student_id' => $student->id,
            'filters' => [
                'academic_year_id' => $yearId,
            ],
            'totals' => [
                'total_amount' => $total,
                'total_discount' => $discount,
                'net_total' => $net,
                'paid_total' => $paid,
                'pending_total' => $pending,
            ],
            'charges' => $charges,
        ]);
    }

    /**
     * DASHBOARD ADMIN (resumen general)
     * GET /api/dashboard
     */
    public function dashboard(Request $request)
    {
        $today = now()->toDateString();
        $monthStart = now()->startOfMonth()->toDateString();

        // Estudiantes
        $studentsCount = DB::table('students')->count();

        // Asistencia hoy
        $attendanceToday = DB::table('attendance')
            ->whereDate('date', $today)
            ->select('status', DB::raw('COUNT(*)::int as total'))
            ->groupBy('status')
            ->orderBy('status')
            ->get();

        // Cargos vencidos o pendientes
        $chargesPending = DB::table('charges')
            ->whereIn('status', ['pendiente','vencido','pagado_parcial'])
            ->count();

        // Pagos del mes (suma)
        $paymentsMonthSum = 0;
        if (Schema::hasColumn('payments', 'paid_at')) {
            $paymentsMonthSum = (float) (DB::table('payments')
                ->whereDate('paid_at', '>=', $monthStart)
                ->sum('amount'));
        } else {
            // fallback por created_at
            $paymentsMonthSum = (float) (DB::table('payments')
                ->whereDate('created_at', '>=', $monthStart)
                ->sum('amount'));
        }

        // Comunicados publicados recientes
        $announcementsPublished = DB::table('announcements')
            ->where('status', 'publicado')
            ->count();

        // Tareas próximas a vencer (si existe due_date en assignments)
        $assignmentsDueSoon = 0;
        if (Schema::hasColumn('assignments', 'due_date')) {
            $assignmentsDueSoon = DB::table('assignments')
                ->whereNotNull('due_date')
                ->whereDate('due_date', '>=', $today)
                ->whereDate('due_date', '<=', now()->addDays(7)->toDateString())
                ->count();
        }

        // Evaluaciones publicadas (si existe status)
        $evaluationsPublished = 0;
        if (Schema::hasColumn('evaluations', 'status')) {
            $evaluationsPublished = DB::table('evaluations')
                ->where('status', 'publicada')
                ->count();
        }

        return response()->json([
            'date' => $today,
            'students_count' => $studentsCount,
            'attendance_today' => $attendanceToday,
            'charges_pending_count' => $chargesPending,
            'payments_month_sum' => $paymentsMonthSum,
            'announcements_published_count' => $announcementsPublished,
            'assignments_due_7days_count' => $assignmentsDueSoon,
            'evaluations_published_count' => $evaluationsPublished,
        ]);
    }
}
