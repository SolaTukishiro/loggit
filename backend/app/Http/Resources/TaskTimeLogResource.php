<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TaskTimeLogResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                       => $this->id,
            'task_id'                  => $this->task_id,
            'activity_log_id'          => $this->activity_log_id,
            'duration_minutes'         => $this->duration_minutes,
            'worked_on'                => $this->worked_on?->format('Y-m-d'),
            'note'                     => $this->note,
            'created_at'               => $this->created_at->setTimezone('Asia/Tokyo')->toIso8601String(),
        ];
    }
}