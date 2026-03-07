<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Attendance extends Model
{
    protected $table = 'attendance';

    protected $fillable = [
        'student_id',
        'course_id',
        'section_id',
        'date',
        'status',      // enum attendance_status (ej: present/absent/late/justified)
        'notes',       // si existe en tu tabla; si no existe, quítalo
        'marked_by',   // si existe (teacher/profile/user); si no existe, quítalo
    ];

    protected $casts = [
        'date' => 'date',
    ];

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class, 'student_id');
    }

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class, 'course_id');
    }

    public function section(): BelongsTo
    {
        return $this->belongsTo(Section::class, 'section_id');
    }

    public function justifications(): HasMany
    {
        return $this->hasMany(AttendanceJustification::class, 'attendance_id');
    }
}
