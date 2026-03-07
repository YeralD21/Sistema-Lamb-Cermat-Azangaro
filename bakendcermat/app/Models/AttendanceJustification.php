<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AttendanceJustification extends Model
{
    protected $table = 'attendance_justifications';

    protected $fillable = [
        'attendance_id',
        'guardian_id',
        'reason',
        'status',       // enum justification_status (ej: pending/approved/rejected)
        'reviewed_by',  // si existe; si no existe, quítalo
        'reviewed_at',  // si existe; si no existe, quítalo
    ];

    protected $casts = [
        'reviewed_at' => 'datetime',
    ];

    public function attendance(): BelongsTo
    {
        return $this->belongsTo(Attendance::class, 'attendance_id');
    }

    public function guardian(): BelongsTo
    {
        return $this->belongsTo(Guardian::class, 'guardian_id');
    }
}
