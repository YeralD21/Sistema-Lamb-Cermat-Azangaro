<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCourseScheduleRequest;
use App\Http\Requests\UpdateCourseScheduleRequest;
use App\Models\CourseSchedule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CourseScheduleController extends Controller
{
    public function index(Request $request)
    {
        $query = CourseSchedule::query()
            ->with(['academicYear', 'section', 'course', 'teacher']);

        // Filtros básicos
        foreach (['academic_year_id','section_id','course_id','teacher_id','day_of_week'] as $f) {
            if ($request->filled($f)) {
                $query->where($f, $request->input($f));
            }
        }

        if ($request->filled('q')) {
            $q = $request->input('q');
            $query->where('room_number', 'ilike', "%{$q}%");
        }

        // Orden
        $sort = $request->input('sort', 'day_of_week');
        $dir  = strtolower($request->input('dir', 'asc')) === 'desc' ? 'desc' : 'asc';

        $allowedSorts = ['day_of_week','start_time','end_time','created_at'];
        if (!in_array($sort, $allowedSorts, true)) {
            $sort = 'day_of_week';
        }

        $query->orderBy($sort, $dir)->orderBy('start_time', 'asc');

        return response()->json($query->paginate(20));
    }

    public function store(StoreCourseScheduleRequest $request)
    {
        $data = $request->validated();

        // Validar cruces de horario usando función de la BD
        $overlap = $this->checkOverlap(
            $data['section_id'],
            (int)$data['day_of_week'],
            $data['start_time'],
            $data['end_time'],
            null
        );

        if ($overlap) {
            return response()->json([
                'message' => 'Cruce de horario: ya existe una clase en ese rango de horas para esa sección y día.'
            ], 422);
        }

        $row = CourseSchedule::create($data);

        return response()->json([
            'message' => 'Horario creado correctamente',
            'data' => $row->load(['academicYear','section','course','teacher'])
        ], 201);
    }

    public function show($id)
    {
        $row = CourseSchedule::with(['academicYear','section','course','teacher'])->find($id);

        if (!$row) {
            return response()->json(['message' => 'Horario no encontrado'], 404);
        }

        return response()->json($row);
    }

    public function update(UpdateCourseScheduleRequest $request, $id)
    {
        $row = CourseSchedule::find($id);

        if (!$row) {
            return response()->json(['message' => 'Horario no encontrado'], 404);
        }

        $data = $request->validated();

        // Construir valores finales para validar cruce
        $sectionId = $data['section_id'] ?? $row->section_id;
        $day       = (int)($data['day_of_week'] ?? $row->day_of_week);
        $start     = $data['start_time'] ?? $row->start_time;
        $end       = $data['end_time'] ?? $row->end_time;

        $overlap = $this->checkOverlap($sectionId, $day, $start, $end, $row->id);

        if ($overlap) {
            return response()->json([
                'message' => 'Cruce de horario: ya existe una clase en ese rango de horas para esa sección y día.'
            ], 422);
        }

        $row->update($data);

        return response()->json([
            'message' => 'Horario actualizado',
            'data' => $row->load(['academicYear','section','course','teacher'])
        ]);
    }

    public function destroy($id)
    {
        $row = CourseSchedule::find($id);

        if (!$row) {
            return response()->json(['message' => 'Horario no encontrado'], 404);
        }

        $row->delete();

        return response()->json(['message' => 'Horario eliminado']);
    }

    private function checkOverlap(string $sectionId, int $dayOfWeek, string $startTime, string $endTime, ?string $scheduleId): bool
    {
        // SELECT public.check_schedule_overlap(p_section_id, p_day_of_week, p_start_time, p_end_time, p_schedule_id)
        $res = DB::selectOne(
            "select public.check_schedule_overlap(?, ?, ?::time, ?::time, ?::uuid) as overlap",
            [$sectionId, $dayOfWeek, $startTime, $endTime, $scheduleId]
        );

        return (bool)($res->overlap ?? false);
    }
}
