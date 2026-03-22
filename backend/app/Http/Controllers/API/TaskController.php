<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\Task\StoreTaskRequest;
use App\Http\Requests\Task\UpdateTaskRequest;
use App\Http\Resources\TaskResource;
use App\Models\Project;
use App\Models\Task;
use App\Services\TaskService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class TaskController extends Controller
{
    public function __construct(
        private TaskService $taskService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $tasks = Task::whereHas('project', fn($q) =>
            $q->where('user_id', auth()->id())
        )
        ->when($request->project_id,      fn($q) => $q->where('project_id', $request->project_id))
        ->when($request->status_id,       fn($q) => $q->where('status_id', $request->status_id))
        ->when($request->priority,        fn($q) => $q->where('priority', $request->priority))
        ->when($request->due_date,        fn($q) => $q->where('due_date', $request->due_date))
        ->when($request->include_deleted, fn($q) => $q->withTrashed())
        ->with(['status', 'children'])
        ->withCount(['children','children as completed_subtask_count' => fn($q) => $q->whereHas('status', fn($q) => $q->where('order', 3))])
        ->withSum('timelogs', 'duration_minutes')
        ->get();

        return TaskResource::collection($tasks)->response();
    }

    public function projectIndex(Request $request, Project $project): JsonResponse
    {
        $this->authorize('view', $project);

        $tasks = $project->tasks()
            ->when($request->status_id, fn($q) => $q->where('status_id', $request->status_id))
            ->with(['status', 'children'])
            ->withCount([
                'children',
                'children as completed_subtask_count' => fn($q) =>
                    $q->whereHas('status', fn($q) => $q->where('order', 3))
            ])
            ->withSum('timelogs', 'duration_minutes')
            ->get();

        return TaskResource::collection($tasks)->response();
    }

    public function store(StoreTaskRequest $request, Project $project): JsonResponse
    {
        $this->authorize('update', $project);
        $data = $request->validated();

        if (isset($data['parent_task_id'])) {
            $depth = $this->taskService->getDepth($data['parent_task_id']);
            if ($depth >= 3) {
                throw new \App\Exceptions\TaskHierarchyException();
            }
        }

        $task = $project->tasks()->create($data);
        return (new TaskResource($this->loadTaskResourceData($task)))->response()->setStatusCode(201);
    }

    public function show(Task $task): JsonResponse
    {
        $this->authorize('view', $task);
        return (new TaskResource($this->loadTaskResourceData($task)))->response();
    }

    public function update(UpdateTaskRequest $request, Task $task): JsonResponse
    {
        $this->authorize('update', $task);
        $data = $request->validated();

        if (isset($data['parent_task_id'])) {
            if ($this->taskService->checkCircularReference($task->id, $data['parent_task_id'])) {
                return response()->json(['message' => '循環参照は設定できません'], 422);
            }
        }

        $task->update($data);
        return (new TaskResource($this->loadTaskResourceData($task)))->response();
    }

    public function destroy(Task $task): Response
    {
        $this->authorize('delete', $task);
        $this->taskService->softDeleteWithChildren($task);
        return response()->noContent();
    }

    public function restore(Task $task): JsonResponse
    {
        $this->authorize('restore', $task);
        $this->taskService->restoreWithChildren($task);
        return (new TaskResource($this->loadTaskResourceData($task->fresh())))->response();
    }

    private function loadTaskResourceData(Task $task): Task
    {
        return $task->load(['status', 'children'])
            ->loadCount([
                'children',
                'children as completed_subtask_count' => fn($q) =>
                    $q->whereHas('status', fn($q) => $q->where('order', 3)),
            ])
            ->loadSum('timelogs', 'duration_minutes');
    }
}
