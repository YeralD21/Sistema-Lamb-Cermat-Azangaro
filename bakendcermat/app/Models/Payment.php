<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Payment extends Model
{
    protected $table = 'payments';

    protected $fillable = [
        'charge_id',
        'student_id',
        'amount',
        'method',      // payment_method
        'reference',
        'paid_at',
        'received_by',
        'notes',
    ];

    protected $casts = [
        'paid_at' => 'datetime',
    ];

    public function charge(): BelongsTo
    {
        return $this->belongsTo(Charge::class, 'charge_id');
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class, 'student_id');
    }

    public function receipt(): HasOne
    {
        return $this->hasOne(Receipt::class, 'payment_id');
    }
}
