<?php

namespace App\Policies;

use App\Models\User;
use App\Models\ActivityLog;

class ActivityLogPolicy
{
    /**
     * Create a new policy instance.
     */
    public function view(User $user, ActivityLog $log): bool {
        return $user->id === $log->user_id;
    }
    public function update(User $user, ActivityLog $log): bool {
        return $user->id === $log->user_id;
    }
    public function delete(User $user, ActivityLog $log): bool {
        return $user->id === $log->user_id;
    }
}
