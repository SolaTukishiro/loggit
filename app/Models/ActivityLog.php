<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ActivityLog extends Model
{
    protected $fillable = [
        'user_id',
        'project_id',
        'started_at',
        'ended_at',
        'note',
        'auto_stopped',
        'acknowledged_at'
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'ended_at' => 'datetime',
        'acknowledged_at' => 'datetime',
        'auto_stopped'    => 'boolean'
    ];

    public function user(){
        return $this->belongsTo(User::class);
    }

    public function project(){
        return $this->belongsTo(Project::class);
    }

    public function taskTimeLogs(){
        return $this->hasMany(TaskTimeLog::class);
    }

    public function taskTimeLog(){
        return $this->taskTimeLogs();
    }

    public function getDurationMinutesAttribute(): ?int
    {
        if (!$this->ended_at) return null;
        return (int) $this->started_at->diffInMinutes($this->ended_at);
    }

    public function getIsTrackingAttribute(): bool
    {
        return is_null($this->ended_at);
}
}
