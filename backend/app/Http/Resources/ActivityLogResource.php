<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ActivityLogResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                => $this->id,
            'project_id'        => $this->project_id,
            'project_name'      => $this->project?->name,
            'started_at'        => $this->started_at->setTimezone('Asia/Tokyo')->toIso8601String(),
            'ended_at'          => $this->ended_at?->setTimezone('Asia/Tokyo')->toIso8601String(),
            'duration_minutes'  => $this->duration_minutes,
            'note'              => $this->note,
            'auto_stopped'      => $this->auto_stopped,
            'is_tracking'       => $this->is_tracking,
            'task_time_logs'    => TaskTimeLogResource::collection(
                $this->whenLoaded('taskTimeLogs')
            ),
            'created_at'        => $this->created_at->setTimezone('Asia/Tokyo')->toIso8601String(),
        ];
    }
}