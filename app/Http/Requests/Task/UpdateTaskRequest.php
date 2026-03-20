<?php

namespace App\Http\Requests\Task;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title'          => ['sometimes', 'string', 'max:255'],
            'description'    => ['nullable', 'string'],
            'status_id'      => ['sometimes', 'integer', 'exists:project_statuses,id'],
            'priority'       => ['nullable', 'integer', 'in:1,2,3'],
            'due_date'       => ['nullable', 'date_format:Y-m-d'],
            'parent_task_id' => ['nullable', 'integer', 'exists:tasks,id'],
        ];
    }
}