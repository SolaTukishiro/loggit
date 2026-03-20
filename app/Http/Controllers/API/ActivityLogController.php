<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\ActivityLog\StartActivityLogRequest;
use App\Http\Requests\ActivityLog\UpdateActivityLogRequest;
use App\Http\Resources\ActivityLogResource;
use App\Http\Resources\SummaryResource;
use App\Models\ActivityLog;
use App\Services\ActivityLogService;
use App\Services\SummaryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ActivityLogController extends Controller
{
    public function __construct(
        private ActivityLogService $activityLogService,
        private SummaryService $summaryService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $logs = ActivityLog::where('user_id', auth()->id())
            ->when($request->project_id, fn($q) => $q->where('project_id', $request->project_id))
            ->with('taskTimeLogs')
            ->orderByDesc('started_at')
            ->paginate(20);

        return ActivityLogResource::collection($logs)->response();
    }

    public function start(StartActivityLogRequest $request): JsonResponse
    {
        $log = $this->activityLogService->start(
            auth()->user(),
            $request->validated()
        );
        return (new ActivityLogResource($log))->response()->setStatusCode(201);
    }

    public function stop(ActivityLog $log): JsonResponse
    {
        $this->authorize('update', $log);
        $stopped = $this->activityLogService->stop($log);
        return (new ActivityLogResource($stopped))->response();
    }

    public function acknowledge(ActivityLog $log): JsonResponse
    {
        $this->authorize('update', $log);
        $log->update(['acknowledged_at' => now()]);
        return (new ActivityLogResource($log->fresh()))->response();
    }

    public function update(UpdateActivityLogRequest $request, ActivityLog $log): JsonResponse
    {
        $this->authorize('update', $log);
        $log->update($request->validated());
        return (new ActivityLogResource($log->fresh()))->response();
    }

    public function destroy(ActivityLog $log): Response
    {
        $this->authorize('delete', $log);
        $log->delete();
        return response()->noContent();
    }

    public function summary(Request $request): JsonResponse
    {
        $period = $request->query('period', 'week');
        $data   = $this->summaryService->getSummary(auth()->user(), $period);
        return (new SummaryResource($data))->response();
    }
}