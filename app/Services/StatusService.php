<?php

namespace App\Services;

use App\Models\Project;

class StatusService
{
    private const MAX_STATUSES = 3;
    private const MIN_STATUSES = 1;

    public function canAdd(Project $project): bool
    {
        return $project->statuses()->count() < self::MAX_STATUSES;
    }

    public function canDelete(Project $project): bool
    {
        return $project->statuses()->count() > self::MIN_STATUSES;
    }

    public function createDefaults(Project $project): void
    {
        $defaults = [
            ['name' => 'Todo',        'order' => 1],
            ['name' => 'In Progress', 'order' => 2],
            ['name' => 'Done',        'order' => 3],
        ];

        foreach ($defaults as $status) {
            $project->statuses()->create($status);
        }
    }
}