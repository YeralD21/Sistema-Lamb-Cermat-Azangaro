<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Notification extends Model
{
    protected $table = 'notifications';

    protected $fillable = [
        'user_id',       // receptor (users.id)
        'type',          // notification_type
        'status',        // notification_status
        'title',         // opcional
        'message',       // opcional
        'data',          // opcional (json)
        'link',          // opcional
        'created_by',    // opcional
        'read_at',       // opcional
    ];

    protected $casts = [
        'data' => 'array',
        'read_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
