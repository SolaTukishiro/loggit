<?php

namespace App\Console\Commands;

use App\Models\ActivityLog;
use Illuminate\Console\Command;

class AutoStopActivityLogs extends Command
{
    protected $signature   = 'activitylogs:auto-stop';
    protected $description = '24時間以上計測中のログを自動停止する';

    public function handle(): void
    {
        $targets = ActivityLog::whereNull('ended_at')
            ->where('started_at', '<=', now()->subHours(24))
            ->get();

        foreach ($targets as $log) {
            $log->update([
                'ended_at'     => $log->started_at->addHours(24),
                'auto_stopped' => true,
            ]);
        }

        $this->info("Auto-stopped {$targets->count()} logs.");
    }
}