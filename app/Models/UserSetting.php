<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserSetting extends Model
{
    protected $fillable = [
        'user_id',
        'enable_task_time_tracking',
    ];

    protected $casts = [
        'enable_task_time_tracking' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
