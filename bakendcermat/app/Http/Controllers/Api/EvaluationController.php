<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreEvaluationRequest;
use App\Http\Requests\UpdateEvaluationRequest;
use App\Models\Evaluation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EvaluationController extends Controller
{
    public function index(Request $request)
    {
        $q = Evaluation::query()->with(['student', 'course', 'competency', 'period']);

        if ($request->filled('student_id')) $q->where('student_id', $request->student_id);
        if ($request->filled('course_id')) $q->where('course_id', $request->course_id);
        if ($request->filled('period_id')) $q->where('period_id', $request->period_id);
        if ($request->filled('competency_id')) $q->where('competency_id', $request->competency_id);
        if ($request->filled('status')) $q->where('status', $request->status);

        return $q->orderByDesc('created_at')->paginate(50);
    }

    public function store(StoreEvaluationRequest $request): JsonResponse
    {
        $data = $this->normalizePayload($request->validated(), $request);

        $evaluation = Evaluation::updateOrCreate(
            [
                'student_id' => $data['student_id'],
                'competency_id' => $data['competency_id'],
                'period_id' => $data['period_id'],
            ],
            $data
        );

        return response()->json($evaluation->fresh()->load(['student', 'course', 'competency', 'period']), 201);
    }

    public function show(Evaluation $evaluation)
    {
        return $evaluation->load(['student', 'course', 'competency', 'period']);
    }

    public function update(UpdateEvaluationRequest $request, Evaluation $evaluation)
    {
        if ($evaluation->status === 'cerrada') {
            return response()->json([
                'message' => 'La evaluación está cerrada y no puede modificarse.',
            ], 422);
        }

        $data = $this->normalizePayload($request->validated(), $request, false);
        $evaluation->update($data);

        return $evaluation->fresh()->load(['student', 'course', 'competency', 'period']);
    }

    public function destroy(Evaluation $evaluation)
    {
        $evaluation->delete();
        return response()->noContent();
    }

    // Opcionales: publish / close si tu enum status lo maneja
    public function publish(Evaluation $evaluation)
    {
        $evaluation->update([
            'status' => 'publicada',
            'published_at' => now(),
        ]);

        return $evaluation->fresh()->load(['student', 'course', 'competency', 'period']);
    }

    public function close(Evaluation $evaluation)
    {
        $payload = [
            'status' => 'cerrada',
        ];

        if (!$evaluation->published_at) {
            $payload['published_at'] = now();
        }

        $evaluation->update($payload);

        return $evaluation->fresh()->load(['student', 'course', 'competency', 'period']);
    }

    public function draft(Evaluation $evaluation)
    {
        if ($evaluation->status === 'cerrada') {
            return response()->json([
                'message' => 'La evaluación cerrada no puede volver a borrador.',
            ], 422);
        }

        $evaluation->update(['status' => 'borrador']);

        return $evaluation->fresh()->load(['student', 'course', 'competency', 'period']);
    }

    private function normalizePayload(array $data, Request $request, bool $isCreate = true): array
    {
        if (array_key_exists('comments', $data) && !array_key_exists('observations', $data)) {
            $data['observations'] = $data['comments'];
        }

        unset($data['comments']);

        if ($request->user()) {
            $data['recorded_by'] = $request->user()->id;
        }

        if (($data['status'] ?? null) === 'publicada' && empty($data['published_at'])) {
            $data['published_at'] = now();
        }

        if (!$isCreate) {
            unset($data['student_id'], $data['course_id'], $data['competency_id'], $data['period_id']);
        }

        return $data;
    }
}
