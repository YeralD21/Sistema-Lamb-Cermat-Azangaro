<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

use App\Models\Profile;
use App\Models\EnrollmentApplication;

class EnrollmentApplicationController extends Controller
{
    // =========================
    // CRUD
    // =========================

    // GET /api/enrollment-applications
    public function index(Request $request)
    {
        $q = EnrollmentApplication::query();

        if ($request->filled('status')) {
            $q->where('status', $request->string('status'));
        }

        if ($request->filled('academic_year_id')) {
            $q->where('academic_year_id', $request->string('academic_year_id'));
        }

        if ($request->filled('grade_level_id')) {
            $q->where('grade_level_id', $request->string('grade_level_id'));
        }

        if ($request->filled('q')) {
            $search = (string) $request->string('q');
            $q->where(function ($qq) use ($search) {
                $qq->where('student_first_name', 'ilike', "%{$search}%")
                    ->orWhere('student_last_name', 'ilike', "%{$search}%")
                    ->orWhere('student_document_number', 'ilike', "%{$search}%")
                    ->orWhere('guardian_document_number', 'ilike', "%{$search}%");
            });
        }

        $perPage = (int) $request->integer('per_page', 15);

        $data = $q->orderByDesc('created_at')->paginate($perPage);

        return response()->json($data);
    }

    // POST /api/enrollment-applications
    public function store(Request $request)
    {
        $data = $request->validate([
            'student_first_name' => ['required', 'string'],
            'student_last_name' => ['required', 'string'],
            'student_document_type' => ['required', 'string'],
            'student_document_number' => ['required', 'string'],
            'student_birth_date' => ['required', 'date'],
            'student_gender' => ['required', 'string'],

            'student_address' => ['nullable', 'string'],
            'student_photo_url' => ['nullable', 'string'],

            'guardian_first_name' => ['required', 'string'],
            'guardian_last_name' => ['required', 'string'],
            'guardian_document_type' => ['required', 'string'],
            'guardian_document_number' => ['required', 'string'],
            'guardian_phone' => ['nullable', 'string'],
            'guardian_email' => ['nullable', 'email'],
            'guardian_address' => ['nullable', 'string'],
            'guardian_relationship' => ['nullable', 'string'],

            'grade_level_id' => ['required', 'uuid', 'exists:grade_levels,id'],
            'academic_year_id' => ['required', 'uuid', 'exists:academic_years,id'],

            'previous_school' => ['nullable', 'string'],
            'has_special_needs' => ['nullable', 'boolean'],
            'special_needs_description' => ['nullable', 'string'],
            'emergency_contact_name' => ['nullable', 'string'],
            'emergency_contact_phone' => ['nullable', 'string'],

            'notes' => ['nullable', 'string'],
        ]);

        $app = EnrollmentApplication::create($data);

        return response()->json([
            'message' => 'Solicitud creada',
            'data' => $app
        ], 201);
    }

    // GET /api/enrollment-applications/{id}
    public function show(string $id)
    {
        $app = EnrollmentApplication::findOrFail($id);
        return response()->json($app);
    }

    // PUT/PATCH /api/enrollment-applications/{id}
    public function update(Request $request, string $id)
    {
        $app = EnrollmentApplication::findOrFail($id);

        // Solo permitir editar si está pending
        if ($app->status !== 'pending') {
            return response()->json(['message' => 'Solo se puede editar si está pending.'], 422);
        }

        $data = $request->validate([
            'student_first_name' => ['sometimes', 'string'],
            'student_last_name' => ['sometimes', 'string'],
            'student_document_type' => ['sometimes', 'string'],
            'student_document_number' => ['sometimes', 'string'],
            'student_birth_date' => ['sometimes', 'date'],
            'student_gender' => ['sometimes', 'string'],

            'student_address' => ['sometimes', 'nullable', 'string'],
            'student_photo_url' => ['sometimes', 'nullable', 'string'],

            'guardian_first_name' => ['sometimes', 'string'],
            'guardian_last_name' => ['sometimes', 'string'],
            'guardian_document_type' => ['sometimes', 'string'],
            'guardian_document_number' => ['sometimes', 'string'],
            'guardian_phone' => ['sometimes', 'nullable', 'string'],
            'guardian_email' => ['sometimes', 'nullable', 'email'],
            'guardian_address' => ['sometimes', 'nullable', 'string'],
            'guardian_relationship' => ['sometimes', 'nullable', 'string'],

            'grade_level_id' => ['sometimes', 'uuid', 'exists:grade_levels,id'],
            'academic_year_id' => ['sometimes', 'uuid', 'exists:academic_years,id'],

            'previous_school' => ['sometimes', 'nullable', 'string'],
            'has_special_needs' => ['sometimes', 'boolean'],
            'special_needs_description' => ['sometimes', 'nullable', 'string'],
            'emergency_contact_name' => ['sometimes', 'nullable', 'string'],
            'emergency_contact_phone' => ['sometimes', 'nullable', 'string'],

            'notes' => ['sometimes', 'nullable', 'string'],
        ]);

        $app->update($data);

        return response()->json([
            'message' => 'Solicitud actualizada',
            'data' => $app
        ]);
    }

    // DELETE /api/enrollment-applications/{id}
    public function destroy(string $id)
    {
        $app = EnrollmentApplication::findOrFail($id);
        $app->delete();

        return response()->json([
            'message' => 'Solicitud eliminada'
        ]);
    }

    // =========================
    // ACTIONS
    // =========================

    // POST /api/enrollment-applications/{id}/approve
    public function approve(Request $request, string $id)
    {
        $app = EnrollmentApplication::findOrFail($id);

        if ($app->status !== 'pending') {
            return response()->json([
                'message' => 'Solo se pueden aprobar solicitudes en estado pending.'
            ], 422);
        }

        $data = $request->validate([
            'section_id' => ['required', 'uuid', 'exists:sections,id'],
        ]);

        $user = $request->user();

        // use relation and create profile if missing
        $profile = $user->profile;
        if (! $profile) {
            $profile = Profile::create([
                'user_id' => $user->id,
                'role' => 'admin',
                'full_name' => $user->name ?? 'Sin nombre',
                'status' => 'active',
            ]);
        }
        $profileId = $profile->id;

        $result = DB::selectOne(
            "SELECT * FROM public.approve_enrollment_application(?, ?, ?)",
            [$id, $data['section_id'], $profileId]
        );

        if (!$result) {
            return response()->json([
                'message' => 'No se pudo aprobar la solicitud (la función SQL no retornó respuesta).'
            ], 500);
        }

        // refrescar estado por si la función lo actualizó
        $app->refresh();

        return response()->json([
            'message' => $result->message ?? 'Solicitud aprobada',
            'data' => [
                'result' => $result,
                'application' => $app
            ]
        ]);
    }

    // POST /api/enrollment-applications/{id}/reject
    public function reject(Request $request, string $id)
    {
        $app = EnrollmentApplication::findOrFail($id);

        if ($app->status !== 'pending') {
            return response()->json([
                'message' => 'Solo se pueden rechazar solicitudes en estado pending.'
            ], 422);
        }

        $data = $request->validate([
            'rejection_reason' => ['required', 'string'],
        ]);

        $user = $request->user();

        // prefer relationship; ensure a profile exists
        $profile = $user->profile;
        if (! $profile) {
            $profile = Profile.create([
                'user_id' => $user->id,
                'role' => 'admin',
                'full_name' => $user->name ?? 'Sin nombre',
                'status' => 'active',
            ]);
        }
        $profileId = $profile->id;

        $app->update([
            'status' => 'rejected',
            'reviewed_at' => Carbon::now(),
            'reviewed_by' => $profileId,
            'rejection_reason' => $data['rejection_reason'],
        ]);

        return response()->json([
            'message' => 'Solicitud rechazada',
            'data' => $app
        ]);
    }
}
