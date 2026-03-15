<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Profile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function index(Request $request)
{
    $role = $request->query('role');

    $query = User::with('profile');

    if ($role) {
        $query->whereHas('profile', function ($q) use ($role) {
            $q->where('role', $role);
        });
    }

    $users = $query->get();

    return response()->json($users);
}
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8'],
            'role' => ['required', 'string', Rule::in(['admin', 'teacher', 'student', 'guardian', 'cashier', 'administrative'])],
        ]);

        try {
            return DB::transaction(function () use ($validated) {
                // 1. Create User
                $user = User::create([
                    'id' => Str::uuid(),
                    'name' => explode(' ', $validated['name'])[0],
                    'email' => $validated['email'],
                    'password' => Hash::make($validated['password']),
                    'email_verified_at' => now(),
                ]);

                // 2. Create Profile
                $profile = Profile::create([
                    'id' => Str::uuid(),
                    'user_id' => $user->id,
                    'role' => $validated['role'],
                    'full_name' => $validated['name'],
                    'email' => $validated['email'],
                    'is_active' => true,
                ]);

                return response()->json([
                    'message' => 'Usuario creado exitosamente',
                    'user' => $user->load('profile'),
                ], 201);
            });
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al crear el usuario',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
