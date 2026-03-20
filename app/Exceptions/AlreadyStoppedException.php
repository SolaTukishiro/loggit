<?php

namespace App\Exceptions;

use Illuminate\Http\JsonResponse;
use RuntimeException;

class AlreadyTrackingException extends RuntimeException
{
    public function render(): JsonResponse
    {
        return response()->json([
            'message' => 'すでに計測中の活動ログがあります',
            'errors'  => [],
        ], 422);
    }
}