<?php

namespace App\Exceptions;

use Illuminate\Http\JsonResponse;
use RuntimeException;

class AlreadyStoppedException extends RuntimeException
{
    public function render(): JsonResponse
    {
        return response()->json([
            'message' => 'この活動ログはすでに停止されています',
            'errors'  => [],
        ], 422);
    }
}