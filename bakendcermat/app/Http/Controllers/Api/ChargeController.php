<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreChargeRequest;
use App\Http\Requests\UpdateChargeRequest;
use App\Models\Charge;
use App\Models\FinancialPlan;
use App\Models\Student;
use App\Models\StudentDiscount;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class ChargeController extends Controller
{
    public function index(Request $request)
    {
        $q = Charge::with(['student.section.gradeLevel', 'concept', 'payments']);
        $perPage = max(1, min((int) $request->integer('per_page', 50), 1000));

        if ($request->filled('student_id')) {
            $q->where('student_id', $request->student_id);
        }

        if ($request->filled('academic_year_id')) {
            $q->where('academic_year_id', $request->academic_year_id);
        }

        if ($request->filled('status')) {
            $q->where('status', $request->status);
        }

        if ($request->filled('type')) {
            $q->where('type', $request->type);
        }

        if ($request->filled('concept_id')) {
            $q->where('concept_id', $request->concept_id);
        }

        return $q->orderByDesc('due_date')->orderByDesc('created_at')->paginate($perPage);
    }

    public function store(StoreChargeRequest $request)
    {
        $data = $request->validated();
        $data['status'] = $data['status'] ?? 'pendiente';
        $data['discount_amount'] = $data['discount_amount'] ?? 0;
        $data['paid_amount'] = $data['paid_amount'] ?? 0;

        if (Schema::hasColumn('charges', 'created_by')) {
            $data['created_by'] = $request->user()->id;
        }

        $charge = Charge::create($data);

        return response()->json(
            $charge->load(['student.section.gradeLevel', 'concept', 'payments']),
            201
        );
    }

    public function show(Charge $charge)
    {
        return $charge->load(['student.section.gradeLevel', 'concept', 'payments']);
    }

    public function update(UpdateChargeRequest $request, Charge $charge)
    {
        $charge->update($request->validated());

        return $charge->load(['student.section.gradeLevel', 'concept', 'payments']);
    }

    public function batchStore(Request $request)
    {
        $request->validate([
            'academic_year_id' => 'required|uuid|exists:academic_years,id',
            'financial_plan_id' => 'required|uuid|exists:financial_plans,id',
            'grade_level_id' => 'nullable|uuid|exists:grade_levels,id',
            'section_id' => 'nullable|uuid|exists:sections,id',
        ]);

        $academicYearId = $request->academic_year_id;
        $plan = FinancialPlan::with(['installments', 'concept'])->findOrFail($request->financial_plan_id);

        if ($plan->installments->isEmpty()) {
            return response()->json([
                'message' => 'El plan seleccionado no tiene cuotas configuradas.',
            ], 422);
        }

        $students = Student::whereHas('enrollments', function ($q) use ($academicYearId, $request) {
            $q->where('academic_year_id', $academicYearId);

            if ($request->filled('grade_level_id')) {
                $q->whereHas('section', function ($sectionQuery) use ($request) {
                    $sectionQuery->where('grade_level_id', $request->grade_level_id);
                });
            }

            if ($request->filled('section_id')) {
                $q->where('section_id', $request->section_id);
            }
        })->get();

        $studentIds = $students->pluck('id')->all();

        if (empty($studentIds)) {
            return response()->json([
                'message' => 'No se encontraron estudiantes para los filtros seleccionados.',
                'created_count' => 0,
            ]);
        }

        $studentDiscounts = StudentDiscount::with('discount')
            ->whereIn('student_id', $studentIds)
            ->where('academic_year_id', $academicYearId)
            ->get()
            ->groupBy('student_id');

        $chargeType = in_array($plan->concept?->type, ['matricula', 'pension'], true)
            ? $plan->concept->type
            : 'otro';

        $createdCount = 0;

        DB::transaction(function () use (
            $students,
            $plan,
            $academicYearId,
            $studentDiscounts,
            $request,
            $chargeType,
            &$createdCount
        ) {
            foreach ($students as $student) {
                foreach ($plan->installments as $installment) {
                    $note = "Generado automaticamente - {$plan->name} - Cuota #{$installment->installment_number}";

                    $exists = Charge::where('student_id', $student->id)
                        ->where('academic_year_id', $academicYearId)
                        ->where('concept_id', $plan->concept_id)
                        ->whereDate('due_date', $installment->due_date)
                        ->where('notes', $note)
                        ->exists();

                    if ($exists) {
                        continue;
                    }

                    $amount = (float) $installment->amount;
                    $discountAmount = 0.0;

                    if ($studentDiscounts->has($student->id)) {
                        foreach ($studentDiscounts->get($student->id) as $studentDiscount) {
                            $discount = $studentDiscount->discount;

                            if (!$discount || !$discount->is_active) {
                                continue;
                            }

                            $applies = ($discount->scope === 'todos')
                                || ($discount->scope === $plan->concept?->type)
                                || ($discount->scope === 'especifico' && $discount->specific_concept_id === $plan->concept_id);

                            if (!$applies) {
                                continue;
                            }

                            if ($discount->type === 'porcentaje') {
                                $discountAmount += ($amount * ((float) $discount->value / 100));
                            } else {
                                $discountAmount += (float) $discount->value;
                            }
                        }
                    }

                    $payload = [
                        'student_id' => $student->id,
                        'academic_year_id' => $academicYearId,
                        'concept_id' => $plan->concept_id,
                        'type' => $chargeType,
                        'status' => 'pendiente',
                        'amount' => $amount,
                        'discount_amount' => min($discountAmount, $amount),
                        'due_date' => $installment->due_date,
                        'notes' => $note,
                    ];

                    if (Schema::hasColumn('charges', 'created_by')) {
                        $payload['created_by'] = $request->user()->id ?? null;
                    }

                    Charge::create($payload);
                    $createdCount++;
                }
            }
        });

        return response()->json([
            'message' => "Se han generado {$createdCount} cargos exitosamente.",
            'created_count' => $createdCount,
        ]);
    }

    public function destroy(Charge $charge)
    {
        $charge->delete();

        return response()->noContent();
    }
}
