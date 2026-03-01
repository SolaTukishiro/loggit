<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProjectStatus extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'project_id',
        'name',
        'order'
    ];

    public function project(){
        return $this->belongsTo(Project::class);
    }

    public function tasks(){
        return $this->hasMany(Task::class, 'status_id');
    }

    public function projects(){
        return $this->project();
    }
}
