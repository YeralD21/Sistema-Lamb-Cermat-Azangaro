<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreChargeRequest;
use App\Http\Requests\UpdateChargeRequest;
use App\Models\Charge;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class ChargeController extends Controller
{
    public function index(Request $request)
    {
        $q = Charge::query();

        if ($request->filled('student_id')) $q->where('student_id', $request->student_id);
        if ($request->filled('academic_year_id')) $q->where('academic_year_id', $request->academic_year_id);
        if ($request->filled('status')) $q->where('status', $request->status);
        if ($request->filled('type')) $q->where('type', $request->type);
        if ($request->filled('concept_id')) $q->where('concept_id', $request->concept_id);

        return $q->orderByDesc('due_date')->orderByDesc('created_at')->paginate(50);
    }

    public function store(StoreChargeRequest $request)
    {
        $data = $request->validated();

        // defaults
        $data['status'] = $data['status'] ?? 'pendiente';

        // guardar created_by si existe columna
        if (Schema::hasColumn('charges', 'created_by')) {
            $data['created_by'] = $request->user()->id;
        }

        // normalizar montos
        $data['discount_amount'] = $data['discount_amount'] ?? 0;
        $data['paid_amount'] = $data['paid_amount'] ?? 0;

        $charge = Charge::create($data);

        return response()->json($charge, 201);
    }

    public function show(Charge $charge)
    {
        return $charge->load(['student','concept','payments']);
    }

    public function update(UpdateChargeRequest $request, Charge $charge)
    {
        $charge->update($request->validated());
        return $charge;
    }

    public function batchStore(Request $request)
    {
        $request->validate([
            'academic_year_id' => 'required|uuid|exists:academic_years,id',
            'financial_plan_id' => 'required|uuid|exists:financial_plans,id',
            'grade_level_id'    => 'nullable|uuid|exists:grade_levels,id',
            'section_id'        => 'nullable|uuid|exists:sections,id',
        ]);

        $academicYearId = $request->academic_year_id;
        $planId = $request->financial_plan_id;
        
        $plan = \App\Models\FinancialPlan::with('installments')->findOrFail($planId);
        
        // Buscar estudiantes
        $studentQuery = \App\Models\Student::whereHas('enrollments', function($q) use ($academicYearId, $request) {
            $q->where('academic_year_id', $academicYearId);
            if ($request->grade_level_id) $q->where('grade_level_id', $request->grade_level_id);
            if ($request->section_id)     $q->where('section_id', $request->section_id);
        });

        $students = $studentQuery->get();
        $studentIds = $students->pluck('id')->toArray();

        // Cargar descuentos de estudiantes para este año
        $studentDiscounts = \App\Models\StudentDiscount::with('discount')
            ->whereIn('student_id', $studentIds)
            ->where('academic_year_id', $academicYearId)
            ->get()
            ->groupBy('student_id');

        $createdCount = 0;

        DB::transaction(function() use ($students, $plan, $academicYearId, $studentDiscounts, $request, &$createdCount) {
            foreach ($students as $student) {
                foreach ($plan->installments as $inst) {
                    // Evitar duplicados
                    $exists = Charge::where('student_id', $student->id)
                        ->where('academic_year_id', $academicYearId)
                        ->where('concept_id', $plan->concept_id)
                        ->where('notes', 'LIKE', "%Cuota #{$inst->installment_number}%")
                        ->exists();

                    if (!$exists) {
                        $amount = $inst->amount;
                        $discountAmount = 0;
                        
                        // Aplicar descuentos si existen
                        if ($studentDiscounts->has($student->id)) {
                            foreach ($studentDiscounts->get($student->id) as $sd) {
                                $discount = $sd->discount;
                                
                                // Reglas de aplicación (alcance)
                                $applies = ($discount->scope === 'todos') ||
                                           ($discount->scope === $plan->concept->type) ||
                                           ($discount->scope === 'especifico' && $discount->specific_concept_id === $plan->concept_id);
                                
                                if ($applies && $discount->is_active) {
                                    if ($discount->type === 'porcentaje') {
                                        $discountAmount += ($amount * ($discount->value / 100));
                                    } else {
                                        $discountAmount += $discount->value;
                                    }
                                }
                            }
                        }

                        // Asegurar que el descuento no exceda el monto
                        $discountAmount = min($discountAmount, $amount);

                        Charge::create([
                            'student_id'       => $student->id,
                            'academic_year_id' => $academicYearId,
                            'concept_id'       => $plan->concept_id,
                            'type'             => 'pension', 
                            'status'           => 'pendiente',
                            'amount'           => $amount,
                            'discount_amount'  => $discountAmount,
                            'due_date'         => $inst->due_date,
                            'notes'            => "Generado automáticamente - {$plan->name} - Cuota #{$inst->installment_number}",
                            'created_by'       => $request->user()->id ?? null
                        ]);
                        $createdCount++;
                    }
                }
            }
        });

        return response()->json([
            'message' => "Se han generado {$createdCount} cargos exitosamente.",
            'created_count' => $createdCount
        ]);
    }

    public function destroy(Charge $charge)
    {
        $charge->delete();
        return response()->noContent();
    }
}
