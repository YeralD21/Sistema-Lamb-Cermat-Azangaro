<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\AcademicYear;
use App\Models\Section;
use App\Models\Student;
use App\Services\AcademicEvaluationService;

class AcademicEvaluationController extends Controller
{
    public function __construct(
        private readonly AcademicEvaluationService $academicEvaluationService
    ) {
    }

    public function summary(AcademicYear $academicYear, Student $student)
    {
        return response()->json(
            $this->academicEvaluationService->getStudentYearSummary($student, $academicYear)
        );
    }

    public function sectionDashboard(Request $request, AcademicYear $academicYear, Section $section)
    {
        return response()->json(
            $this->academicEvaluationService->getSectionDashboard($section, $academicYear, $request->only([
                'course_id',
                'period_id',
                'competency_id',
            ]))
        );
    }

    public function recalculate(AcademicYear $academicYear, Student $student)
    {
        return response()->json(
            $this->academicEvaluationService->recalculateStudentYear($student, $academicYear, request()->user()?->id)
        );
    }

    public function recalculateSection(AcademicYear $academicYear, Section $section)
    {
        return response()->json(
            $this->academicEvaluationService->recalculateSection($section, $academicYear, request()->user()?->id)
        );
    }
}
