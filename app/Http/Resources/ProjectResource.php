<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                    => $this->id,
            'name'                  => $this->name,
            'description'           => $this->description,
            'color'                 => $this->color,
            'due_date'              => $this->due_date?->format('Y-m-d'),
            'task_count'            => $this->tasks()->count(),
            'completed_task_count'  => $this->tasks()
                ->whereHas('status', fn($q) => $q->where('order', 3))->count(),
            'statuses'              => ProjectStatusResource::collection(
                $this->whenLoaded('statuses')
            ),
            'created_at'            => $this->created_at->setTimezone('Asia/Tokyo')->toIso8601String(),
            'updated_at'            => $this->updated_at->setTimezone('Asia/Tokyo')->toIso8601String(),
        ];
    }
}