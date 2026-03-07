<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Receipt extends Model
{
    protected $table = 'receipts';

    protected $fillable = [
        'payment_id',
        'student_id',
        'number',
        'issued_at',
        'total',
        'notes',
    ];

    protected $casts = [
        'issued_at' => 'datetime',
    ];

    public function payment(): BelongsTo
    {
        return $this->belongsTo(Payment::class, 'payment_id');
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class, 'student_id');
    }
}
