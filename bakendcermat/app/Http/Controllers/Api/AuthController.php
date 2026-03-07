<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\LoginRequest;
use App\Models\Profile;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller as RoutingController;
use Illuminate\Support\Facades\Hash;

class AuthController extends RoutingController
{
    public function login(LoginRequest $request)
    {
        $credentials = $request->validated();

        $user = User::where('email', $credentials['email'])->first();

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            return response()->json([
                'message' => 'Credenciales incorrectas.'
            ], 401);
        }

        $profile = Profile::where('user_id', (string) $user->id)->first();

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

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()?->delete();

        return response()->json([
            'message' => 'Sesión cerrada.'
        ]);
    }
}
