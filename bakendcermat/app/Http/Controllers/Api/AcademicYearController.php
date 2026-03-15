<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAcademicYearRequest;
use App\Http\Requests\UpdateAcademicYearRequest;
use App\Models\AcademicYear;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AcademicYearController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = AcademicYear::query();

        if ($request->has('year')) {
            $query->where('year', $request->year);
        }

        if ($request->has('is_active')) {
            $query->where('is_active', filter_var($request->is_active, FILTER_VALIDATE_BOOLEAN));
        }

        $perPage   = $request->integer('per_page', 20);
        $useSimple = $request->boolean('simple', false);
        $query->orderByDesc('year');

        return response()->json(
            $useSimple ? $query->simplePaginate($perPage) : $query->paginate($perPage)
        );
    }

    public function store(StoreAcademicYearRequest $request): JsonResponse
    {
        // Si el nuevo año se marca activo, desactiva los demás
        if ($request->boolean('is_active')) {
            AcademicYear::where('is_active', true)->update(['is_active' => false]);
        }

        $year = AcademicYear::create($request->validated());

        return response()->json([
            'message' => 'Año académico creado correctamente.',
            'data'    => $year,
        ], 201);
    }

    public function show($id): JsonResponse
    {
        $year = AcademicYear::find($id);

        if (!$year) {
            return response()->json(['message' => 'Año académico no encontrado.'], 404);
        }

        return response()->json(['data' => $year]);
    }

    public function update(UpdateAcademicYearRequest $request, $id): JsonResponse
    {
        $year = AcademicYear::find($id);

        if (!$year) {
            return response()->json(['message' => 'Año académico no encontrado.'], 404);
        }

        // Si este año se marca activo, desactiva los demás (excepto el actual)
        if ($request->boolean('is_active')) {
            AcademicYear::where('is_active', true)
                ->where('id', '!=', $id)
                ->update(['is_active' => false]);
        }

        $year->update($request->validated());

        return response()->json([
            'message' => 'Año académico actualizado correctamente.',
            'data'    => $year->fresh(),
        ]);
    }

    public function destroy($id): JsonResponse
    {
        $year = AcademicYear::find($id);

        if (!$year) {
            return response()->json(['message' => 'Año académico no encontrado.'], 404);
        }

        $year->delete();

        return response()->json(['message' => 'Año académico eliminado correctamente.']);
    }
}