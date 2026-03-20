<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\Project\StoreProjectRequest;
use App\Http\Requests\Project\UpdateProjectRequest;
use App\Http\Resources\ProjectResource;
use App\Models\Project;
use App\Services\StatusService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

class ProjectController extends Controller
{
    public function __construct(
        private StatusService $statusService
    ) {}

    public function index(): JsonResponse
    {
        $projects = auth()->user()->projects()
            ->with('statuses')
            ->withCount([
                'tasks',
                'tasks as completed_task_count' => fn($q) =>
                    $q->whereHas('status', fn($q) => $q->where('order', 3))
            ])
            ->get();

        return ProjectResource::collection($projects)->response();
    }

    public function store(StoreProjectRequest $request): JsonResponse
    {
        $project = auth()->user()->projects()->create($request->validated());
        $this->statusService->createDefaults($project);
        return (new ProjectResource($project->load('statuses')))->response()->setStatusCode(201);
    }

    public function show(Project $project): JsonResponse
    {
        $this->authorize('view', $project);
        $project->loadCount([
            'tasks',
            'tasks as completed_task_count' => fn($q) =>
                $q->whereHas('status', fn($q) => $q->where('order', 3))
        ]);
        return (new ProjectResource($project->load('statuses')))->response();
    }

    public function update(UpdateProjectRequest $request, Project $project): JsonResponse
    {
        $this->authorize('update', $project);
        $project->update($request->validated());
        $project->loadCount([
            'tasks',
            'tasks as completed_task_count' => fn($q) =>
                $q->whereHas('status', fn($q) => $q->where('order', 3))
        ]);
        return (new ProjectResource($project->load('statuses')))->response();
    }

    public function destroy(Project $project): Response
    {
        $this->authorize('delete', $project);
        $project->delete();
        return response()->noContent();
    }
}