<?php

namespace App\Services;

use App\Exceptions\AlreadyTrackingException;
use App\Exceptions\AlreadyStoppedException;
use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class ActivityLogService
{
    public function start(User $user, array $data): ActivityLog
    {
        return DB::transaction(function () use ($user, $data) {
            $active = ActivityLog::where('user_id', $user->id)
                ->whereNull('ended_at')
                ->lockForUpdate()
                ->first();

            if ($active) {
                throw new AlreadyTrackingException();
            }

            return ActivityLog::create([
                'user_id'    => $user->id,
                'project_id' => $data['project_id'] ?? null,
                'note'       => $data['note'] ?? null,
                'started_at' => now(),
            ]);
        });
    }

    public function stop(ActivityLog $log): ActivityLog
    {
        return DB::transaction(function () use ($log) {
            $log = ActivityLog::lockForUpdate()->find($log->id);

            if ($log->ended_at !== null) {
                throw new AlreadyStoppedException();
            }

            $log->update([
                'ended_at'     => now(),
                'auto_stopped' => false,
            ]);

            return $log->fresh();
        });
    }
}