<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Profile;
use App\Http\Requests\StoreProfileRequest;
use App\Http\Requests\UpdateProfileRequest;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function index(Request $request)
    {
        $query = Profile::query();

        if ($request->has('role')) $query->where('role', $request->role);
        if ($request->has('is_active')) $query->where('is_active', filter_var($request->is_active, FILTER_VALIDATE_BOOLEAN));
        if ($request->has('q')) {
            $q = $request->q;
            $query->where('full_name', 'ilike', "%{$q}%");
        }

        return response()->json($query->orderByDesc('created_at')->paginate(20));
    }

    public function store(StoreProfileRequest $request)
    {
        $row = Profile::create($request->validated());
        return response()->json(['message' => 'Perfil creado', 'data' => $row], 201);
    }

    public function show($id)
    {
        $row = Profile::find($id);
        if (!$row) return response()->json(['message' => 'Perfil no encontrado'], 404);
        return response()->json($row);
    }

    public function update(UpdateProfileRequest $request, $id)
    {
        $row = Profile::find($id);
        if (!$row) return response()->json(['message' => 'Perfil no encontrado'], 404);

        $row->update($request->validated());
        return response()->json(['message' => 'Perfil actualizado', 'data' => $row]);
    }

    public function destroy($id)
    {
        $row = Profile::find($id);
        if (!$row) return response()->json(['message' => 'Perfil no encontrado'], 404);

        $row->delete();
        return response()->json(['message' => 'Perfil eliminado']);
    }
}
