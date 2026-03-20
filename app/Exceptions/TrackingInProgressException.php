<?php

namespace App\Exceptions;

use Illuminate\Http\JsonResponse;
use RuntimeException;

class TrackingInProgressException extends RuntimeException
{
    public function render(): JsonResponse
    {
        return response()->json([
            'message' => '計測中の活動ログには配賦できません',
            'errors'  => [],
        ], 422);
    }
}