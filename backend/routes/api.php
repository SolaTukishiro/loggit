<?php

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\ProjectController;
use App\Http\Controllers\API\ProjectStatusController;
use App\Http\Controllers\API\TaskController;
use App\Http\Controllers\API\ActivityLogController;
use App\Http\Controllers\API\TaskTimeLogController;
use App\Http\Controllers\API\UserController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    // プロジェクト
    Route::apiResource('projects', ProjectController::class);
    Route::get('projects/{project}/statuses',    [ProjectStatusController::class, 'index']);
    Route::put('projects/{project}/statuses/{status}', [ProjectStatusController::class, 'update']);

    // タスク
    Route::get('tasks',                          [TaskController::class, 'index']);
    Route::get('projects/{project}/tasks',       [TaskController::class, 'projectIndex']);
    Route::post('projects/{project}/tasks',      [TaskController::class, 'store']);
    Route::get('tasks/{task}',                   [TaskController::class, 'show']);
    Route::put('tasks/{task}',                   [TaskController::class, 'update']);
    Route::delete('tasks/{task}',                [TaskController::class, 'destroy']);
    Route::post('tasks/{task}/restore',          [TaskController::class, 'restore'])->withTrashed();

    // 活動ログ
    Route::get('activity-logs',                  [ActivityLogController::class, 'index']);
    Route::get('activity-logs/summary',          [ActivityLogController::class, 'summary']);
    Route::post('activity-logs/start',           [ActivityLogController::class, 'start']);
    Route::post('activity-logs/{log}/stop',      [ActivityLogController::class, 'stop']);
    Route::post('activity-logs/{log}/acknowledge', [ActivityLogController::class, 'acknowledge']);
    Route::put('activity-logs/{log}',            [ActivityLogController::class, 'update']);
    Route::delete('activity-logs/{log}',         [ActivityLogController::class, 'destroy']);

    // タスク時間配賦
    Route::get('tasks/{task}/time-logs',         [TaskTimeLogController::class, 'index']);
    Route::post('tasks/{task}/time-logs',        [TaskTimeLogController::class, 'store']);
    Route::delete('tasks/{task}/time-logs/{timeLog}', [TaskTimeLogController::class, 'destroy']);

    // ユーザー設定
    Route::get('settings',                       [UserController::class, 'settings']);
    Route::put('settings',                       [UserController::class, 'updateSettings']);
    Route::put('user',                           [UserController::class, 'update']);
    Route::put('user/password',                  [UserController::class, 'updatePassword']);
});