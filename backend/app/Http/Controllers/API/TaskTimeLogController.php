<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\TaskTimeLog\StoreTaskTimeLogRequest;
use App\Http\Resources\TaskTimeLogResource;
use App\Models\ActivityLog;
use App\Models\Task;
use App\Models\TaskTimeLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

class TaskTimeLogController extends Controller
{
    public function index(Task $task): JsonResponse
    {
        $this->authorize('view', $task);
        $timeLogs = $task->timelogs()->orderByDesc('worked_on')->get();
        return TaskTimeLogResource::collection($timeLogs)->response();
    }

    public function store(StoreTaskTimeLogRequest $request, Task $task): JsonResponse
    {
        $this->authorize('update', $task);
        $data = $request->validated();

        if (!isset($data['worked_on'])) {
            $workedOn = null;

            if (!empty($data['activity_log_id'])) {
                $activityLog = ActivityLog::query()->find($data['activity_log_id']);
                $workedOn = $activityLog?->started_at?->timezone('Asia/Tokyo')->toDateString();
            }

            // activity_log_id 経由で導けない場合のみ今日の日付を使う
            $data['worked_on'] = $workedOn ?? now('Asia/Tokyo')->toDateString();
        }

        $timeLog = $task->timelogs()->create($data);
        return (new TaskTimeLogResource($timeLog))->response()->setStatusCode(201);
    }

    public function destroy(Task $task, TaskTimeLog $timeLog): Response|JsonResponse
    {
        $this->authorize('update', $task);

        if ($timeLog->task_id !== $task->id) {
            return response()->json(['message' => 'この時間ログはタスクに属していません'], 403);
        }

        $timeLog->delete();
        return response()->noContent();
    }
}
