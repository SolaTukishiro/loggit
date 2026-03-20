<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TaskResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                      => $this->id,
            'project_id'              => $this->project_id,
            'project_name'            => $this->project?->name,
            'parent_task_id'          => $this->parent_task_id,
            'status'                  => new ProjectStatusResource($this->status),
            'title'                   => $this->title,
            'description'             => $this->description,
            'priority'                => $this->priority,
            'priority_label'          => $this->priority_label,
            'due_date'                => $this->due_date?->format('Y-m-d'),
            'subtasks'                => TaskResource::collection(
                $this->whenLoaded('children')
            ),
            'subtask_count'           => $this->children()->count(),
            'completed_subtask_count' => $this->children()
                ->whereHas('status', fn($q) => $q->where('order', 3))->count(),
            'total_tracked_minutes'   => $this->total_tracked_minutes,
            'deleted_at'              => $this->deleted_at?->setTimezone('Asia/Tokyo')->toIso8601String(),
            'created_at'              => $this->created_at->setTimezone('Asia/Tokyo')->toIso8601String(),
            'updated_at'              => $this->updated_at->setTimezone('Asia/Tokyo')->toIso8601String(),
        ];
    }
}