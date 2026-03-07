<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Assignment extends Model
{
    protected $table = 'assignments';

protected $fillable = [
    'course_id',
    'section_id',
    'title',
    'description',
    'instructions',
    'due_date',
    'max_score',
    'attachment_url',
    'created_by'
];

    public function submissions(): HasMany
    {
        return $this->hasMany(TaskSubmission::class, 'assignment_id');
    }

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class, 'course_id');
    }

    public function section(): BelongsTo
    {
        return $this->belongsTo(Section::class, 'section_id');
    }

}
