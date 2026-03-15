<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AcademicYear;
use App\Http\Requests\StoreAcademicYearRequest;
use App\Http\Requests\UpdateAcademicYearRequest;
use Illuminate\Http\Request;

class AcademicYearController extends Controller
{
    public function index(Request $request)
    {
        $query = AcademicYear::query();

        // filtros opcionales
        if ($request->has('year')) {
            $query->where('year', $request->year);
        }

        if ($request->has('is_active')) {
            $query->where('is_active', filter_var($request->is_active, FILTER_VALIDATE_BOOLEAN));
        }

        $perPage = (int) $request->integer('per_page', 20);
        $useSimple = $request->boolean('simple', false);

        $query = $query->orderByDesc('year');

        return response()->json(
            $useSimple ? $query->simplePaginate($perPage) : $query->paginate($perPage)
        );
    }

    public function store(StoreAcademicYearRequest $request)
    {
        $year = AcademicYear::create($request->validated());

        return response()->json([
            'message' => 'Año académico creado correctamente',
            'data' => $year
        ], 201);
    }

    public function show($id)
    {
        $year = AcademicYear::find($id);

        if (!$year) {
            return response()->json([
                'message' => 'Año académico no encontrado'
            ], 404);
        }

        return response()->json($year);
    }

    public function update(UpdateAcademicYearRequest $request, $id)
    {
        $year = AcademicYear::find($id);

        if (!$year) {
            return response()->json([
                'message' => 'Año académico no encontrado'
            ], 404);
        }

        $year->update($request->validated());

        return response()->json([
            'message' => 'Año académico actualizado',
            'data' => $year
        ]);
    }

    public function destroy($id)
    {
        $year = AcademicYear::find($id);

        if (!$year) {
            return response()->json([
                'message' => 'Año académico no encontrado'
            ], 404);
        }

        $year->delete();

        return response()->json([
            'message' => 'Año académico eliminado'
        ]);
    }
}
