<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\LoginRequest;
use App\Models\AcademicYear;
use App\Models\Guardian;
use App\Models\Profile;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller as RoutingController;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class AuthController extends RoutingController
{
    public function login(LoginRequest $request)
    {
        $credentials = $request->validated();
        $normalizedEmail = strtolower(trim((string) $credentials['email']));

        $user = User::query()
            ->whereRaw('lower(email) = ?', [$normalizedEmail])
            ->first();

        $hashMatches = $user ? Hash::check((string) $credentials['password'], (string) $user->password) : false;

        Log::info('AuthController@login attempt', [
            'email' => $normalizedEmail,
            'user_found' => (bool) $user,
            'user_id' => $user?->id,
            'hash_matches' => $hashMatches,
        ]);

        if (!$user || !$hashMatches) {
            return response()->json([
                'message' => 'Credenciales incorrectas.'
            ], 401);
        }

        $profile = Profile::query()
            ->where('user_id', (string) $user->id)
            ->first();

        if (!$profile) {
            $profile = Profile::query()
                ->whereNull('user_id')
                ->whereRaw('lower(email) = ?', [$normalizedEmail])
                ->first();
        }

        if ($profile && !$profile->user_id) {
            $profile->update(['user_id' => (string) $user->id]);
        }

        if (!$profile) {
            $profile = Profile::create([
                'id' => (string) $user->id,
                'user_id' => (string) $user->id,
                'role' => 'admin',
                'full_name' => $user->name ?? 'Sin nombre',
                'email' => $user->email,
                'is_active' => true,
            ]);
        }

        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => $user->fresh()->load('profile'),
        ]);
    }

    public function me(Request $request)
    {
        return response()->json([
            'user' => $request->user()?->load('profile')
        ]);
    }

    public function academicContext(Request $request)
    {
        $user = $request->user()?->load('profile');
        $role = $user?->profile?->role;
        $activeAcademicYear = AcademicYear::query()
            ->where('is_active', true)
            ->orderByDesc('year')
            ->first();

        $students = collect();

        if ($user && $role === 'student') {
            $students = Student::query()
                ->with(['section.gradeLevel'])
                ->where('user_id', $user->id)
                ->get();
        }

        if ($user && $role === 'guardian') {
            $guardian = Guardian::query()
                ->where('user_id', $user->id)
                ->first();

            if ($guardian) {
                $students = $guardian->students()
                    ->with(['section.gradeLevel'])
                    ->orderBy('last_name')
                    ->orderBy('first_name')
                    ->get();
            }
        }

        return response()->json([
            'user' => $user,
            'role' => $role,
            'active_academic_year' => $activeAcademicYear ? [
                'id' => $activeAcademicYear->id,
                'year' => $activeAcademicYear->year,
                'start_date' => $activeAcademicYear->start_date,
                'end_date' => $activeAcademicYear->end_date,
                'is_active' => $activeAcademicYear->is_active,
            ] : null,
            'students' => $students->map(function (Student $student) {
                return [
                    'id' => $student->id,
                    'student_code' => $student->student_code,
                    'full_name' => $student->full_name,
                    'section_id' => $student->section_id,
                    'section' => $student->section ? [
                        'id' => $student->section->id,
                        'section_letter' => $student->section->section_letter,
                        'grade_level' => $student->section->gradeLevel ? [
                            'id' => $student->section->gradeLevel->id,
                            'name' => $student->section->gradeLevel->name,
                            'level' => $student->section->gradeLevel->level,
                            'grade' => $student->section->gradeLevel->grade,
                        ] : null,
                    ] : null,
                ];
            })->values(),
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()?->delete();

        return response()->json([
            'message' => 'Sesión cerrada.'
        ]);
    }
}
