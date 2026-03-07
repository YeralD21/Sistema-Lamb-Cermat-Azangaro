<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAssignmentRequest;
use App\Http\Requests\UpdateAssignmentRequest;
use App\Models\Assignment;
use Illuminate\Http\Request;

class AssignmentController extends Controller
{
    public function index(Request $request)
    {
        $q = Assignment::query();

        if ($request->filled('course_id')) {
            $q->where('course_id', $request->course_id);
        }

        if ($request->filled('section_id')) {
            $q->where('section_id', $request->section_id);
        }

        return $q->orderByDesc('created_at')->paginate(20);
    }

    public function store(StoreAssignmentRequest $request)
    {
        $data = $request->validated();

        // Si tu tabla tiene created_by como UUID de usuario/perfil:
        $data['created_by'] = $request->user()->id;

        $assignment = Assignment::create($data);

        return response()->json($assignment, 201);
    }

    public function show(Assignment $assignment)
    {
        return $assignment;
    }

    public function update(UpdateAssignmentRequest $request, Assignment $assignment)
    {
        $assignment->update($request->validated());
        return $assignment;
    }

    public function destroy(Assignment $assignment)
    {
        $assignment->delete();
        return response()->noContent();
    }
}
