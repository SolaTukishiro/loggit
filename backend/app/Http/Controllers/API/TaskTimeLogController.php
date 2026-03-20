<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\TaskTimeLog\StoreTaskTimeLogRequest;
use App\Http\Resources\TaskTimeLogResource;
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

        // worked_onが未指定の場合は今日の日付をセット
        if (!isset($data['worked_on'])) {
            $data['worked_on'] = now('Asia/Tokyo')->toDateString();
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