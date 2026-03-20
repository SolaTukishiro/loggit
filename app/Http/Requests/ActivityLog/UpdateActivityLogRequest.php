<?php

namespace App\Http\Requests\ActivityLog;

use Illuminate\Foundation\Http\FormRequest;

class UpdateActivityLogRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'started_at' => ['sometimes', 'date_format:Y-m-d H:i:s'],
            'ended_at'   => ['nullable', 'date_format:Y-m-d H:i:s', 'after:started_at'],
            'note'       => ['nullable', 'string'],
            'project_id' => ['nullable', 'integer', 'exists:projects,id'],
        ];
    }
}