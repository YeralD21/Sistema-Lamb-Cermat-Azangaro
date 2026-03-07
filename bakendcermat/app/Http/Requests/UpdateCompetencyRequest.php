<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCompetencyRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'course_id'    => ['sometimes', 'uuid', 'exists:courses,id'],
            'name'         => ['sometimes', 'string', 'max:255'],
            'description'  => ['sometimes', 'nullable', 'string', 'max:2000'],
            'code'         => ['sometimes', 'nullable', 'string', 'max:50'],
            'is_active'    => ['sometimes', 'boolean'],
        ];
    }
}
