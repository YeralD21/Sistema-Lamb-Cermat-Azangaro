<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAttendanceRequest;
use App\Http\Requests\UpdateAttendanceRequest;
use App\Models\Attendance;
use Illuminate\Http\Request;

class AttendanceController extends Controller
{
    public function index(Request $request)
    {
        $q = Attendance::query();

        // Filtros útiles
        if ($request->filled('date')) {
            $q->whereDate('date', $request->date);
        }
        if ($request->filled('student_id')) {
            $q->where('student_id', $request->student_id);
        }
        if ($request->filled('course_id')) {
            $q->where('course_id', $request->course_id);
        }
        if ($request->filled('section_id')) {
            $q->where('section_id', $request->section_id);
        }
        if ($request->filled('status')) {
            $q->where('status', $request->status);
        }

        return $q->orderByDesc('date')->paginate(30);
    }

    public function store(StoreAttendanceRequest $request)
    {
        $data = $request->validated();

        // Si tu tabla tiene marked_by y quieres guardar el usuario:
        if (array_key_exists('marked_by', (new Attendance())->getFillable())) {
            $data['marked_by'] = $request->user()->id;
        }

        // Importante: en tu BD hay UNIQUE(student_id, course_id, date)
        // Si quieres "upsert" en vez de error:
        $attendance = Attendance::updateOrCreate(
            [
                'student_id' => $data['student_id'],
                'course_id'  => $data['course_id'],
                'date'       => $data['date'],
            ],
            $data
        );

        return response()->json($attendance, 201);
    }

    public function show(Attendance $attendance)
    {
        return $attendance->load(['student', 'course', 'section', 'justifications']);
    }

    public function update(UpdateAttendanceRequest $request, Attendance $attendance)
    {
        $attendance->update($request->validated());
        return $attendance;
    }

    public function destroy(Attendance $attendance)
    {
        $attendance->delete();
        return response()->noContent();
    }
}
