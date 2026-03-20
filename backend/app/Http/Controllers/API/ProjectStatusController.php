<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProjectStatusResource;
use App\Models\Project;
use App\Models\ProjectStatus;
use App\Services\StatusService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProjectStatusController extends Controller
{
    public function __construct(
        private StatusService $statusService
    ) {}

    public function index(Project $project): JsonResponse
    {
        $this->authorize('view', $project);
        $statuses = $project->statuses()->orderBy('order')->get();
        return ProjectStatusResource::collection($statuses)->response();
    }

    public function update(Request $request, Project $project, ProjectStatus $status): JsonResponse
    {
        $this->authorize('update', $project);

        // statusが本当にこのprojectのものか確認
        if ($status->project_id !== $project->id) {
            return response()->json(['message' => 'このステータスはプロジェクトに属していません'], 403);
        }

        $request->validate([
            'name' => ['required', 'string', 'max:100'],
        ]);

        $status->update(['name' => $request->name]);
        return (new ProjectStatusResource($status))->response();
    }
}