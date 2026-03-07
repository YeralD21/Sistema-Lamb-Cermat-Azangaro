<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Period;
use App\Http\Requests\StorePeriodRequest;
use App\Http\Requests\UpdatePeriodRequest;
use Illuminate\Http\Request;

class PeriodController extends Controller
{
    public function index(Request $request)
    {
        $query = Period::query();

        if ($request->has('academic_year_id')) {
            $query->where('academic_year_id', $request->academic_year_id);
        }

        if ($request->has('is_closed')) {
            $query->where('is_closed', filter_var($request->is_closed, FILTER_VALIDATE_BOOLEAN));
        }

        return response()->json(
            $query->orderBy('academic_year_id')
                ->orderBy('period_number')
                ->paginate(20)
        );
    }

    public function store(StorePeriodRequest $request)
    {
        $row = Period::create($request->validated());

        return response()->json([
            'message' => 'Periodo creado correctamente',
            'data' => $row
        ], 201);
    }

    public function show($id)
    {
        $row = Period::find($id);

        if (!$row) {
            return response()->json(['message' => 'Periodo no encontrado'], 404);
        }

        return response()->json($row);
    }

    public function update(UpdatePeriodRequest $request, $id)
    {
        $row = Period::find($id);

        if (!$row) {
            return response()->json(['message' => 'Periodo no encontrado'], 404);
        }

        $row->update($request->validated());

        return response()->json([
            'message' => 'Periodo actualizado',
            'data' => $row
        ]);
    }

    public function destroy($id)
    {
        $row = Period::find($id);

        if (!$row) {
            return response()->json(['message' => 'Periodo no encontrado'], 404);
        }

        $row->delete();

        return response()->json(['message' => 'Periodo eliminado']);
    }
}
