<?php

namespace App\Exceptions;

use Illuminate\Http\JsonResponse;
use RuntimeException;

class TaskHierarchyException extends RuntimeException
{
    public function render(): JsonResponse
    {
        return response()->json([
            'message' => 'サブタスクは3階層までしか作成できません',
            'errors'  => [],
        ], 422);
    }
}