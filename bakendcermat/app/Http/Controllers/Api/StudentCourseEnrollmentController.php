<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Section;
use App\Models\Student;
use App\Models\StudentCourseEnrollment;
use Illuminate\Http\Request;

class StudentCourseEnrollmentController extends Controller
{
    // GET /api/student-course-enrollments
    public function index(Request $request)
    {
        $q = StudentCourseEnrollment::query()
            ->with(['student', 'course', 'section.gradeLevel', 'academicYear']);

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
            $q->orderByDesc('enrollment_date')->simplePaginate($perPage)
        );
    }

    // POST /api/student-course-enrollments
    public function store(Request $request)
    {
        $data = $request->validate([
            'student_id' => ['required', 'uuid', 'exists:students,id'],
            'course_id' => ['required', 'uuid', 'exists:courses,id'],
            'section_id' => ['required', 'uuid', 'exists:sections,id'],
            'academic_year_id' => ['required', 'uuid', 'exists:academic_years,id'],
            'status' => ['nullable', 'in:active,dropped,completed'],
            'enrollment_date' => ['nullable', 'date'],
        ]);

        $student = Student::findOrFail($data['student_id']);
        $course = Course::findOrFail($data['course_id']);
        $section = Section::findOrFail($data['section_id']);

        if ((string) $section->academic_year_id !== (string) $data['academic_year_id']) {
            return response()->json([
                'message' => 'La seccion seleccionada no pertenece al año academico indicado.'
            ], 422);
        }

        if ((string) $course->grade_level_id !== (string) $section->grade_level_id) {
            return response()->json([
                'message' => 'El curso no corresponde al grado de la seccion seleccionada.'
            ], 422);
        }

        $exists = StudentCourseEnrollment::query()
            ->where('student_id', $data['student_id'])
            ->where('course_id', $data['course_id'])
            ->where('academic_year_id', $data['academic_year_id'])
            ->exists();

        if ($exists) {
            return response()->json([
                'message' => 'El estudiante ya esta inscrito en este curso para el año academico seleccionado.'
            ], 422);
        }

        $row = StudentCourseEnrollment::create([
            'student_id' => $data['student_id'],
            'course_id' => $data['course_id'],
            'section_id' => $data['section_id'],
            'academic_year_id' => $data['academic_year_id'],
            'status' => $data['status'] ?? 'active',
            'enrollment_date' => $data['enrollment_date'] ?? now()->toDateString(),
        ]);

        if ((string) $student->section_id !== (string) $data['section_id']) {
            $student->update([
                'section_id' => $data['section_id'],
                'enrollment_date' => $student->enrollment_date ?? ($data['enrollment_date'] ?? now()->toDateString()),
            ]);
        }

        return response()->json([
            'message' => 'Curso asignado al estudiante correctamente.',
            'data' => $row->load(['student', 'course', 'section.gradeLevel', 'academicYear']),
        ], 201);
    }

    // GET /api/student-course-enrollments/{id}
    public function show(string $id)
    {
        $row = StudentCourseEnrollment::with(['student', 'course', 'section.gradeLevel', 'academicYear'])
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
