<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProjectResource;
use App\Models\UserSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class UserController extends Controller
{
    public function settings(): JsonResponse
    {
        $setting = auth()->user()->setting
            ?? auth()->user()->setting()->create([
                'enable_task_time_tracking' => true,
            ]);

        return response()->json([
            'data' => [
                'enable_task_time_tracking' => $setting->enable_task_time_tracking,
            ],
        ]);
    }

    public function updateSettings(Request $request): JsonResponse
    {
        $request->validate([
            'enable_task_time_tracking' => ['required', 'boolean'],
        ]);

        $setting = auth()->user()->setting
            ?? auth()->user()->setting()->create([]);

        $setting->update($request->only('enable_task_time_tracking'));

        return response()->json([
            'data' => [
                'enable_task_time_tracking' => $setting->enable_task_time_tracking,
            ],
        ]);
    }

    public function update(Request $request): JsonResponse
    {
        $request->validate([
            'name'  => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email,' . auth()->id()],
        ]);

        auth()->user()->update($request->only('name', 'email'));

        return response()->json([
            'data' => [
                'id'    => auth()->user()->id,
                'name'  => auth()->user()->name,
                'email' => auth()->user()->email,
            ],
        ]);
    }

    public function updatePassword(Request $request): JsonResponse
    {
        $request->validate([
            'current_password' => ['required'],
            'password'         => ['required', 'string', 'min:8'],
        ]);

        if (!Hash::check($request->current_password, auth()->user()->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['現在のパスワードが正しくありません'],
            ]);
        }

        auth()->user()->update([
            'password' => $request->password,
        ]);

        return response()->json([
            'message' => 'パスワードを変更しました',
        ]);
    }
}