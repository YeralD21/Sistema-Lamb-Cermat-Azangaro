<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Section extends Model
{
    use HasUuids;

    protected $table = 'sections';

    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;

    protected $fillable = [
        'academic_year_id',
        'grade_level_id',
        'section_letter',
        'capacity',
        'created_at'
    ];

    protected $casts = [
        'capacity' => 'integer',
        'created_at' => 'datetime'
    ];

    public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class);
    }

    public function gradeLevel()
    {
        return $this->belongsTo(GradeLevel::class);
    }
}
