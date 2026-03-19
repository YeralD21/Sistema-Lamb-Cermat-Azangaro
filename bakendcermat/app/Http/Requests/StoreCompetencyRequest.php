<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCompetencyRequest extends FormRequest
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
            'course_id'    => ['required', 'uuid', 'exists:courses,id'],
            'description'  => ['required', 'string', 'max:2000'],
            'code'         => ['nullable', 'string', 'max:50'],
            'order_index'  => ['nullable', 'integer', 'min:1'],
            'order'        => ['nullable', 'integer', 'min:1'],
            'name'         => ['nullable', 'string', 'max:255'],
        ];
    }
}
