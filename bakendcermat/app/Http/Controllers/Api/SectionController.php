<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Section;
use App\Http\Requests\StoreSectionRequest;
use App\Http\Requests\UpdateSectionRequest;
use Illuminate\Http\Request;

class SectionController extends Controller
{
    public function index(Request $request)
    {
        $query = Section::query();

        if ($request->has('academic_year_id')) {
            $query->where('academic_year_id', $request->academic_year_id);
        }

        if ($request->has('grade_level_id')) {
            $query->where('grade_level_id', $request->grade_level_id);
        }

        return response()->json(
            $query->orderBy('academic_year_id')
                ->orderBy('grade_level_id')
                ->orderBy('section_letter')
                ->paginate(20)
        );
    }

    public function store(StoreSectionRequest $request)
    {
        $row = Section::create($request->validated());

        return response()->json([
            'message' => 'Sección creada correctamente',
            'data' => $row
        ], 201);
    }

    public function show($id)
    {
        $row = Section::find($id);

        if (!$row) {
            return response()->json(['message' => 'Sección no encontrada'], 404);
        }

        return response()->json($row);
    }

    public function update(UpdateSectionRequest $request, $id)
    {
        $row = Section::find($id);

        if (!$row) {
            return response()->json(['message' => 'Sección no encontrada'], 404);
        }

        $row->update($request->validated());

        return response()->json([
            'message' => 'Sección actualizada',
            'data' => $row
        ]);
    }

    public function destroy($id)
    {
        $row = Section::find($id);

        if (!$row) {
            return response()->json(['message' => 'Sección no encontrada'], 404);
        }

        $row->delete();

        return response()->json(['message' => 'Sección eliminada']);
    }
}
