<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Competency extends Model
{
    protected $table = 'competencies';

    protected $fillable = [
        'course_id',
        'name',
        'description',
        'code',        // si existe
        'is_active',   // si existe
    ];

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class, 'course_id');
    }

    public function evaluations(): HasMany
    {
        return $this->hasMany(Evaluation::class, 'competency_id');
    }
}
