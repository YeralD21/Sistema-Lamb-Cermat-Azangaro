<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCompetencyRequest;
use App\Http\Requests\UpdateCompetencyRequest;
use App\Models\Competency;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class CompetencyController extends Controller
{
    public function index(Request $request)
    {
        Log::info('CompetencyController@index request', [
            'course_id' => $request->course_id,
            'q' => $request->q,
            'user_id' => optional($request->user())->id,
        ]);

        $q = Competency::query();

        if ($request->filled('course_id')) $q->where('course_id', $request->course_id);
        if ($request->filled('q')) {
            $search = '%' . $request->q . '%';
            $q->where(function ($query) use ($search) {
                $query->where('description', 'ilike', $search)
                    ->orWhere('code', 'ilike', $search);
            });
        }

        $result = $q->orderBy('order_index')->orderBy('description')->paginate(30);

        Log::info('CompetencyController@index response', [
            'count' => count($result->items()),
            'total' => $result->total(),
        ]);

        return $result;
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
