<?php

namespace App\Http\Requests\TaskTimeLog;

use Illuminate\Foundation\Http\FormRequest;

class StoreTaskTimeLogRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'duration_minutes' => ['required', 'integer', 'min:1'],
            'activity_log_id'  => ['nullable', 'integer', 'exists:activity_logs,id'],
            'worked_on'        => ['nullable', 'date_format:Y-m-d'],
            'note'             => ['nullable', 'string'],
        ];
    }
}