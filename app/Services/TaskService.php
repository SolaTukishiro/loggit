<?php

namespace App\Services;

use App\Exceptions\TaskHierarchyException;
use App\Models\Task;

class TaskService
{
    public function getDepth(int $parentTaskId): int
    {
        $depth = 1;
        $currentId = $parentTaskId;

        while ($currentId !== null) {
            $task = Task::withTrashed()->find($currentId);
            if (!$task) break;
            $currentId = $task->parent_task_id;
            $depth++;
            if ($depth > 3) break;
        }

        return $depth;
    }

    public function checkCircularReference(int $taskId, int $parentId): bool
    {
        if ($taskId === $parentId) return true;

        $currentId = $parentId;
        while ($currentId !== null) {
            $task = Task::find($currentId);
            if (!$task) break;
            if ($task->parent_task_id === $taskId) return true;
            $currentId = $task->parent_task_id;
        }

        return false;
    }

    public function softDeleteWithChildren(Task $task): void
    {
        $task->children()->each(fn($child) =>
            $this->softDeleteWithChildren($child)
        );
        $task->delete();
    }

    public function restoreWithChildren(Task $task): void
    {
        $task->restore();
        $task->children()->withTrashed()->each(fn($child) =>
            $this->restoreWithChildren($child)
        );
    }
}