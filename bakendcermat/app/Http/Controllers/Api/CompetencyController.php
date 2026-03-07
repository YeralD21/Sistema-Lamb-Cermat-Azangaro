<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCompetencyRequest;
use App\Http\Requests\UpdateCompetencyRequest;
use App\Models\Competency;
use Illuminate\Http\Request;

class CompetencyController extends Controller
{
    public function index(Request $request)
    {
        $q = Competency::query();

        if ($request->filled('course_id')) $q->where('course_id', $request->course_id);
        if ($request->filled('q')) $q->where('name', 'ilike', '%'.$request->q.'%');

        return $q->orderBy('name')->paginate(30);
    }

    public function store(StoreCompetencyRequest $request)
    {
        $competency = Competency::create($request->validated());
        return response()->json($competency, 201);
    }

    public function show(Competency $competency)
    {
        return $competency->load('course');
    }

    public function update(UpdateCompetencyRequest $request, Competency $competency)
    {
        $competency->update($request->validated());
        return $competency;
    }

    public function destroy(Competency $competency)
    {
        $competency->delete();
        return response()->noContent();
    }
}
