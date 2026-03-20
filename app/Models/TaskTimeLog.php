<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TaskTimeLog extends Model
{
    protected $fillable = [
        'task_id',
        'activity_log_id',
        'duration_minutes',
        'worked_on',
        'note',
    ];

    protected $casts = [
        'worked_on'        => 'date',
        'duration_minutes' => 'integer',
        'activity_log_id'  => 'integer',
    ];

    public function task(){
        return $this->belongsTo(Task::class);
    }

    public function activityLog(){
        return $this->belongsTo(ActivityLog::class);
    }
}
