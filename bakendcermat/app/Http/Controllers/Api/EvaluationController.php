<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreEvaluationRequest;
use App\Http\Requests\UpdateEvaluationRequest;
use App\Models\Evaluation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

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

        $recorderId = $this->resolveRecorderId($request);
        if ($recorderId) {
            $data['recorded_by'] = $recorderId;
        } else {
            // Ensure recorded_by is not set if we can't resolve a valid user
            unset($data['recorded_by']);
        }

        if (($data['status'] ?? null) === 'publicada' && empty($data['published_at'])) {
            $data['published_at'] = now();
        }

        if (!$isCreate) {
            unset($data['student_id'], $data['course_id'], $data['competency_id'], $data['period_id']);
        }

        return $data;
    }

    private function resolveRecorderId(Request $request): ?string
    {
        $authUser = $request->user();

        if (!$authUser) {
            return null;
        }

        $emailCandidates = array_values(array_filter([
            $authUser->email ?? null,
            $authUser->profile?->email ?? null,
        ]));

        foreach ($emailCandidates as $email) {
            $authSchemaUserId = DB::table('auth.users')
                ->whereRaw('lower(email) = ?', [strtolower((string) $email)])
                ->value('id');

            if ($authSchemaUserId) {
                Log::info('EvaluationController: resolved recorded_by from auth.users', [
                    'email' => (string) $email,
                    'recorded_by' => (string) $authSchemaUserId,
                ]);

                return (string) $authSchemaUserId;
            }
        }

        $candidates = array_values(array_filter([
            $authUser->id ?? null,
            $authUser->user_id ?? null,
            $authUser->profile?->user_id ?? null,
        ]));

        foreach ($candidates as $candidate) {
            $candidate = (string) $candidate;

            if ($candidate !== '' && DB::table('auth.users')->where('id', $candidate)->exists()) {
                Log::info('EvaluationController: resolved recorded_by from auth.users candidate', [
                    'recorded_by' => $candidate,
                ]);

                return $candidate;
            }
        }

        // Log the issue for debugging
        Log::warning('EvaluationController: Could not resolve valid recorder_id', [
            'auth_user_id' => $authUser->id ?? 'null',
            'auth_user_user_id' => $authUser->user_id ?? 'null',
            'auth_profile_user_id' => $authUser->profile?->user_id ?? 'null',
            'auth_user_email' => $authUser->email ?? 'null',
            'auth_profile_email' => $authUser->profile?->email ?? 'null',
            'candidates' => $candidates,
        ]);

        return null;
    }
}
