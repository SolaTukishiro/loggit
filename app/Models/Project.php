<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\ProjectStatus;
use App\Models\Task;
use App\Models\ActivityLog;

class Project extends Model
{
    protected $fillable = ['user_id', 'name', 'description', 'color', 'due_date'];
    protected $casts    = ['due_date' => 'date'];
    public function user(){
        return $this->belongsTo(User::class);
    }
    public function statuses(){
        return $this->hasMany(ProjectStatus::class)->orderBy('order');
    }
    public function tasks(){
        return $this->hasMany(Task::class);
    }
    public function activityLogs(){
        return $this->hasMany(ActivityLog::class);
    }
    // タスク数（完了・全件）
    public function getTaskCountAttribute(): int {
        return $this->tasks()->count();
    }
    public function getCompletedTaskCountAttribute(): int {
        return $this->tasks()
            ->whereHas('status', fn($q) => $q->where('order', 3))->count();
    }
}
