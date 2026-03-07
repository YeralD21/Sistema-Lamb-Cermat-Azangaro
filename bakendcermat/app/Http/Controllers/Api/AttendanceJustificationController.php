<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\AttendanceJustification;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AttendanceJustificationController extends Controller
{
    public function index(Request $request)
    {
        $q = AttendanceJustification::query();

        if ($request->filled('status')) {
            $q->where('status', $request->status);
        }
        if ($request->filled('guardian_id')) {
            $q->where('guardian_id', $request->guardian_id);
        }
        if ($request->filled('attendance_id')) {
            $q->where('attendance_id', $request->attendance_id);
        }

        return $q->orderByDesc('created_at')->paginate(30);
    }

    // Crear justificación (guardian/admin)
    public function store(Request $request)
    {
        $data = $request->validate([
            'attendance_id' => ['required', 'uuid', 'exists:attendance,id'],
            'guardian_id'   => ['required', 'uuid', 'exists:guardians,id'],
            'reason'        => ['required', 'string', 'max:1500'],

            // opcional: si quieres permitir enviar status (normalmente no)
            'status'        => ['sometimes', 'string', Rule::in(['pendiente','aprobada','rechazada'])],
        ]);

        $just = AttendanceJustification::create([
            'attendance_id' => $data['attendance_id'],
            'guardian_id'   => $data['guardian_id'],
            'reason'        => $data['reason'],
            'status'        => $data['status'] ?? 'pendiente',
        ]);

        return response()->json($just, 201);
    }

    public function show(AttendanceJustification $attendanceJustification)
    {
        return $attendanceJustification->load(['attendance', 'guardian']);
    }

    // Aprobar
    public function approve(Request $request, AttendanceJustification $attendanceJustification)
    {
        $update = [
            'status' => 'aprobada',
        ];

        // ✅ Solo setear reviewed_by/reviewed_at si existen esas columnas
        if ($this->hasColumn('attendance_justifications', 'reviewed_by')) {
            $update['reviewed_by'] = $request->user()->id;
        }
        if ($this->hasColumn('attendance_justifications', 'reviewed_at')) {
            $update['reviewed_at'] = now();
        }

        $attendanceJustification->update($update);

        // ✅ Marcar asistencia como "justificado"
        $attendance = Attendance::find($attendanceJustification->attendance_id);
        if ($attendance) {
            $attendance->update(['status' => 'justificado']);
        }

        return $attendanceJustification->fresh()->load(['attendance', 'guardian']);
    }

    // Rechazar
    public function reject(Request $request, AttendanceJustification $attendanceJustification)
    {
        $update = [
            'status' => 'rechazada',
        ];

        if ($this->hasColumn('attendance_justifications', 'reviewed_by')) {
            $update['reviewed_by'] = $request->user()->id;
        }
        if ($this->hasColumn('attendance_justifications', 'reviewed_at')) {
            $update['reviewed_at'] = now();
        }

        $attendanceJustification->update($update);

        return $attendanceJustification->fresh()->load(['attendance', 'guardian']);
    }

    public function destroy(AttendanceJustification $attendanceJustification)
    {
        $attendanceJustification->delete();
        return response()->noContent();
    }

    /**
     * Helper: verifica si una columna existe en una tabla (PostgreSQL).
     */
    private function hasColumn(string $table, string $column): bool
    {
        return \Illuminate\Support\Facades\Schema::hasColumn($table, $column);
    }
}
