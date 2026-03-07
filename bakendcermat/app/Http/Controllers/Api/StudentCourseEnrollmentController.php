<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\StudentCourseEnrollment;
use Illuminate\Http\Request;

class StudentCourseEnrollmentController extends Controller
{
    // GET /api/student-course-enrollments
    public function index(Request $request)
    {
        $q = StudentCourseEnrollment::query()
            ->with(['student', 'course', 'section', 'academicYear']);

        if ($request->filled('student_id')) {
            $q->where('student_id', $request->string('student_id'));
        }
        if ($request->filled('course_id')) {
            $q->where('course_id', $request->string('course_id'));
        }
        if ($request->filled('section_id')) {
            $q->where('section_id', $request->string('section_id'));
        }
        if ($request->filled('academic_year_id')) {
            $q->where('academic_year_id', $request->string('academic_year_id'));
        }
        if ($request->filled('status')) {
            $q->where('status', $request->string('status'));
        }

        $perPage = (int) $request->integer('per_page', 15);

        return response()->json(
            $q->orderByDesc('enrollment_date')->paginate($perPage)
        );
    }

    // GET /api/student-course-enrollments/{id}
    public function show(string $id)
    {
        $row = StudentCourseEnrollment::with(['student', 'course', 'section', 'academicYear'])
            ->findOrFail($id);

        return response()->json($row);
    }

    // PATCH /api/student-course-enrollments/{id}
    public function update(Request $request, string $id)
    {
        $row = StudentCourseEnrollment::findOrFail($id);

        $data = $request->validate([
            'status' => ['required', 'in:active,dropped,completed'],
        ]);

        $row->update($data);

        return response()->json([
            'message' => 'Matrícula actualizada',
            'data' => $row
        ]);
    }
}
