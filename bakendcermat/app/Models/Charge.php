<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Charge extends Model
{
    use HasUuids;

    protected $table = 'charges';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'student_id',
        'academic_year_id',
        'concept_id',

        'type',       // charge_type
        'status',     // charge_status

        'amount',
        'discount_amount',
        'paid_amount',
        'due_date',
        'notes',
        'created_by',
    ];

    protected $casts = [
        'due_date' => 'date',
    ];

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class, 'student_id');
    }

    public function concept(): BelongsTo
    {
        return $this->belongsTo(FeeConcept::class, 'concept_id');
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class, 'charge_id');
    }
}
