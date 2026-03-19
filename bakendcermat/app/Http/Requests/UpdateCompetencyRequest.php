<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCompetencyRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'description' => $this->input('description') ?: $this->input('name'),
            'order_index' => $this->input('order_index') ?? $this->input('order'),
        ]);
    }

    public function rules(): array
    {
        return [
            'course_id'    => ['sometimes', 'uuid', 'exists:courses,id'],
            'description'  => ['sometimes', 'nullable', 'string', 'max:2000'],
            'code'         => ['sometimes', 'nullable', 'string', 'max:50'],
            'order_index'  => ['sometimes', 'nullable', 'integer', 'min:1'],
            'order'        => ['sometimes', 'nullable', 'integer', 'min:1'],
            'name'         => ['sometimes', 'nullable', 'string', 'max:255'],
        ];
    }
}
