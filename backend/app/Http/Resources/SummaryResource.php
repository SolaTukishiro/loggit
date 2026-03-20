<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SummaryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'total_activity_minutes' => $this->resource['total_activity_minutes'],
            'total_tracked_minutes'  => $this->resource['total_tracked_minutes'],
            'period'                 => $this->resource['period'],
            'start'                  => $this->resource['start'],
            'end'                    => $this->resource['end'],
        ];
    }
}