<?php

namespace App\Services;

use App\Models\ActivityLog;
use App\Models\TaskTimeLog;
use App\Models\User;
use Carbon\Carbon;

class SummaryService
{
    public function getSummary(User $user, string $period): array
    {
        [$start, $end] = $this->getPeriodRange($period);

        // 総活動時間（activity_logsベース）
        $totalActivity = ActivityLog::where('user_id', $user->id)
            ->whereNotNull('ended_at')
            ->whereBetween('started_at', [$start, $end])
            ->selectRaw('SUM(TIMESTAMPDIFF(MINUTE, started_at, ended_at)) as total')
            ->value('total') ?? 0;

        // 総配賦時間（task_time_logsベース）
        $totalTracked = TaskTimeLog::whereHas('task.project', fn($q) =>
            $q->where('user_id', $user->id)
        )->whereBetween('worked_on', [$start->toDateString(), $end->toDateString()])
            ->sum('duration_minutes');

        return [
            'total_activity_minutes' => (int) $totalActivity,
            'total_tracked_minutes'  => (int) $totalTracked,
            'period'                 => $period,
            'start'                  => $start->toDateString(),
            'end'                    => $end->toDateString(),
        ];
    }

    private function getPeriodRange(string $period): array
    {
        $now = Carbon::now('Asia/Tokyo');
        if ($period === 'week') {
            $start = $now->copy()->startOfWeek(Carbon::SUNDAY)->utc();
            $end   = $now->copy()->endOfWeek(Carbon::SATURDAY)->utc();
        } else {
            $start = $now->copy()->startOfMonth()->utc();
            $end   = $now->copy()->endOfMonth()->utc();
        }
        return [$start, $end];
    }
}