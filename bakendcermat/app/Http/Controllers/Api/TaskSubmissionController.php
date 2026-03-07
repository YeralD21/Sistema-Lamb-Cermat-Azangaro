<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTaskSubmissionRequest;
use App\Http\Requests\UpdateTaskSubmissionRequest;
use App\Http\Requests\GradeTaskSubmissionRequest;
use App\Models\TaskSubmission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TaskSubmissionController extends Controller
{
    public function index(Request $request)
    {
        $query = TaskSubmission::query()
            ->with(['assignment', 'student']);

        foreach (['assignment_id','student_id','status','graded_by'] as $f) {
            if ($request->filled($f)) {
                $query->where($f, $request->input($f));
            }
        }

        // filtros por rango de fechas
        if ($request->filled('from')) {
            $query->where('submission_date', '>=', $request->input('from'));
        }
        if ($request->filled('to')) {
            $query->where('submission_date', '<=', $request->input('to'));
        }

        $sort = $request->input('sort', 'submission_date');
        $dir  = strtolower($request->input('dir', 'desc')) === 'asc' ? 'asc' : 'desc';

        $allowedSorts = ['submission_date','created_at','updated_at','grade'];
        if (!in_array($sort, $allowedSorts, true)) {
            $sort = 'submission_date';
        }

        $query->orderBy($sort, $dir);

        return response()->json($query->paginate(20));
    }

    public function store(StoreTaskSubmissionRequest $request)
    {
        $data = $request->validated();

        // Evitar doble entrega del mismo estudiante para la misma tarea
        $exists = TaskSubmission::where('assignment_id', $data['assignment_id'])
            ->where('student_id', $data['student_id'])
            ->exists();

        if ($exists) {
            return response()->json([
                'message' => 'Ya existe una entrega para este estudiante en esta tarea. Usa update.'
            ], 422);
        }

        $data['submission_date'] = now();
        $data['status'] = $data['status'] ?? 'submitted';

        $row = TaskSubmission::create($data);

        return response()->json([
            'message' => 'Entrega creada',
            'data' => $row->load(['assignment','student'])
        ], 201);
    }

    public function show($id)
    {
        $row = TaskSubmission::with(['assignment','student'])->find($id);

        if (!$row) {
            return response()->json(['message' => 'Entrega no encontrada'], 404);
        }

        return response()->json($row);
    }

    public function update(UpdateTaskSubmissionRequest $request, $id)
    {
        $row = TaskSubmission::find($id);

        if (!$row) {
            return response()->json(['message' => 'Entrega no encontrada'], 404);
        }

        $data = $request->validated();

        // si el estudiante actualiza, refrescamos fecha
        $data['submission_date'] = now();

        $row->update($data);

        return response()->json([
            'message' => 'Entrega actualizada',
            'data' => $row->load(['assignment','student'])
        ]);
    }

    public function destroy($id)
    {
        $row = TaskSubmission::find($id);

        if (!$row) {
            return response()->json(['message' => 'Entrega no encontrada'], 404);
        }

        $row->delete();

        return response()->json(['message' => 'Entrega eliminada']);
    }

    // ✅ endpoint especial: calificar
public function grade(GradeTaskSubmissionRequest $request, $id)
{
    $row = TaskSubmission::find($id);

    if (!$row) {
        return response()->json(['message' => 'Entrega no encontrada'], 404);
    }

    $user = $request->user();
    $profile = $user?->profile;

    if (!$profile) {
        return response()->json([
            'message' => 'No se encontró perfil asociado al usuario autenticado.'
        ], 422);
    }

    $data = $request->validated();

    $data['graded_by'] = $profile->id;   // ✅ FK a profiles.id
    $data['graded_at'] = now();
    $data['status'] = $data['status'] ?? 'graded';

    $row->update($data);

    return response()->json([
        'message' => 'Entrega calificada',
        'data' => $row->load(['assignment','student','grader'])
    ]);
}
}
