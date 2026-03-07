<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Evaluation extends Model
{
    protected $table = 'evaluations';

    protected $fillable = [
        'student_id',
        'course_id',
        'competency_id',
        'period_id',

        'grade',      // enum evaluation_grade
        'status',     // enum evaluation_status

        'comments',   // si existe
        'evaluated_by', // si existe (user/profile/teacher)
        'evaluated_at', // si existe
    ];

    protected $casts = [
        'evaluated_at' => 'datetime',
    ];

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class, 'student_id');
    }

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class, 'course_id');
    }

    public function competency(): BelongsTo
    {
        return $this->belongsTo(Competency::class, 'competency_id');
    }

    public function period(): BelongsTo
    {
        return $this->belongsTo(Period::class, 'period_id');
    }
}
