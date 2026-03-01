<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Task extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    use SoftDeletes;

    protected $fillable = [
        'project_id',
        'parent_task_id',
        'status_id',
        'title',
        'description',
        'priority',
        'due_date'
    ];

    protected $casts = [
        'due_date' => 'date',
        'priority' => 'integer'
    ];

    public function project(){
        return $this->belongsTo(Project::class);
    }
    
    public function parent(){
        return $this->belongsTo(Task::class, 'parent_task_id');
    }

    public function children(){
        return $this->hasMany(Task::class, 'parent_task_id');
    }

    public function status(){
        return $this->belongsTo(ProjectStatus::class);
    }

    public function timelogs(){
        return $this->hasMany(TaskTimeLog::class);
    }

    public function projects(){
        return $this->project();
    }

    // 優先度ラベル変換
    public function getPriorityLabelAttribute(): string {
        return match($this->priority) {
            1 => 'low', 2 => 'mid', 3 => 'high', default => 'low',
        };
    }
    // 累計配賦時間
    public function getTotalTrackedMinutesAttribute(): int {
        return $this->timelogs()->sum('duration_minutes');
    }
}
