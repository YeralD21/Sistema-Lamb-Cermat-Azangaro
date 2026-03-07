<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCompetencyRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'course_id'    => ['required', 'uuid', 'exists:courses,id'],
            'name'         => ['required', 'string', 'max:255'],
            'description'  => ['nullable', 'string', 'max:2000'],
            'code'         => ['nullable', 'string', 'max:50'],
            'is_active'    => ['nullable', 'boolean'],
        ];
    }
}
