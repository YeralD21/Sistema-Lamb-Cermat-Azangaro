<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\GradeLevel;
use App\Http\Requests\StoreGradeLevelRequest;
use App\Http\Requests\UpdateGradeLevelRequest;
use Illuminate\Http\Request;

class GradeLevelController extends Controller
{
    public function index(Request $request)
    {
        $query = GradeLevel::query();

        if ($request->has('level')) {
            $query->where('level', $request->level);
        }

        if ($request->has('grade')) {
            $query->where('grade', (int) $request->grade);
        }

        $perPage = (int) $request->integer('per_page', 20);
        $useSimple = $request->boolean('simple', false);

        $query = $query->orderBy('level')->orderBy('grade');

        return response()->json(
            $useSimple ? $query->simplePaginate($perPage) : $query->paginate($perPage)
        );
    }

    public function store(StoreGradeLevelRequest $request)
    {
        $row = GradeLevel::create($request->validated());

        return response()->json([
            'message' => 'Nivel/Grado creado correctamente',
            'data' => $row
        ], 201);
    }

    public function show($id)
    {
        $row = GradeLevel::find($id);

        if (!$row) {
            return response()->json(['message' => 'Grade level no encontrado'], 404);
        }

        return response()->json($row);
    }

    public function update(UpdateGradeLevelRequest $request, $id)
    {
        $row = GradeLevel::find($id);

        if (!$row) {
            return response()->json(['message' => 'Grade level no encontrado'], 404);
        }

        $row->update($request->validated());

        return response()->json([
            'message' => 'Nivel/Grado actualizado',
            'data' => $row
        ]);
    }

    public function destroy($id)
    {
        $row = GradeLevel::find($id);

        if (!$row) {
            return response()->json(['message' => 'Grade level no encontrado'], 404);
        }

        $row->delete();

        return response()->json(['message' => 'Nivel/Grado eliminado']);
    }
}
