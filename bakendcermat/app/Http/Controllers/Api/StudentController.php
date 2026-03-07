<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Http\Requests\StoreStudentRequest;
use App\Http\Requests\UpdateStudentRequest;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    public function index(Request $request)
    {
        $query = Student::query();

        if ($request->has('section_id')) $query->where('section_id', $request->section_id);
        if ($request->has('status')) $query->where('status', $request->status);
        if ($request->has('dni')) $query->where('dni', $request->dni);
        if ($request->has('student_code')) $query->where('student_code', $request->student_code);

        if ($request->has('q')) {
            $q = $request->q;
            $query->where(function($sub) use ($q) {
                $sub->where('first_name', 'ilike', "%{$q}%")
                    ->orWhere('last_name', 'ilike', "%{$q}%")
                    ->orWhere('student_code', 'ilike', "%{$q}%");
            });
        }

        return response()->json($query->orderBy('last_name')->orderBy('first_name')->paginate(20));
    }

    public function store(StoreStudentRequest $request)
    {
        $row = Student::create($request->validated());
        return response()->json(['message' => 'Estudiante creado', 'data' => $row], 201);
    }

    public function show($id)
    {
        $row = Student::find($id);
        if (!$row) return response()->json(['message' => 'Estudiante no encontrado'], 404);
        return response()->json($row);
    }

    public function update(UpdateStudentRequest $request, $id)
    {
        $row = Student::find($id);
        if (!$row) return response()->json(['message' => 'Estudiante no encontrado'], 404);

        $row->update($request->validated());
        return response()->json(['message' => 'Estudiante actualizado', 'data' => $row]);
    }

    public function destroy($id)
    {
        $row = Student::find($id);
        if (!$row) return response()->json(['message' => 'Estudiante no encontrado'], 404);

        $row->delete();
        return response()->json(['message' => 'Estudiante eliminado']);
    }
}
