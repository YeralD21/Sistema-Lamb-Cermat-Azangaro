<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreEvaluationRequest;
use App\Http\Requests\UpdateEvaluationRequest;
use App\Models\Evaluation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;

class EvaluationController extends Controller
{
    public function index(Request $request)
    {
        $q = Evaluation::query();

        if ($request->filled('student_id')) $q->where('student_id', $request->student_id);
        if ($request->filled('course_id')) $q->where('course_id', $request->course_id);
        if ($request->filled('period_id')) $q->where('period_id', $request->period_id);
        if ($request->filled('competency_id')) $q->where('competency_id', $request->competency_id);
        if ($request->filled('status')) $q->where('status', $request->status);

        return $q->orderByDesc('created_at')->paginate(50);
    }

    public function store(StoreEvaluationRequest $request)
    {
        $data = $request->validated();

        // si existe evaluated_by/evaluated_at en tabla, lo setea
        if (Schema::hasColumn('evaluations', 'evaluated_by')) {
            $data['evaluated_by'] = $request->user()->id;
        }
        if (Schema::hasColumn('evaluations', 'evaluated_at')) {
            $data['evaluated_at'] = now();
        }

        // recomendable: evitar duplicado por estudiante+competencia+periodo
        // si tu BD tiene unique, esto ayuda como upsert:
        $evaluation = Evaluation::updateOrCreate(
            [
                'student_id' => $data['student_id'],
                'competency_id' => $data['competency_id'],
                'period_id' => $data['period_id'],
                'course_id' => $data['course_id'],
            ],
            $data
        );

        return response()->json($evaluation, 201);
    }

    public function show(Evaluation $evaluation)
    {
        return $evaluation->load(['student','course','competency','period']);
    }

    public function update(UpdateEvaluationRequest $request, Evaluation $evaluation)
    {
        $data = $request->validated();

        if (Schema::hasColumn('evaluations', 'evaluated_by')) {
            $data['evaluated_by'] = $request->user()->id;
        }
        if (Schema::hasColumn('evaluations', 'evaluated_at')) {
            $data['evaluated_at'] = now();
        }

        $evaluation->update($data);
        return $evaluation;
    }

    public function destroy(Evaluation $evaluation)
    {
        $evaluation->delete();
        return response()->noContent();
    }

    // Opcionales: publish / close si tu enum status lo maneja
public function publish(Evaluation $evaluation)
{
    $evaluation->update(['status' => 'publicada']);
    return $evaluation;
}

public function close(Evaluation $evaluation)
{
    $evaluation->update(['status' => 'cerrada']);
    return $evaluation;
}
public function draft(Evaluation $evaluation)
{
    $evaluation->update(['status' => 'borrador']);
    return $evaluation;
}
}
