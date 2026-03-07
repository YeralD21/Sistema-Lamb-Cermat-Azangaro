<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCourseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'code' => ['required','string','unique:courses,code'],
            'name' => ['required','string'],
            'description' => ['nullable','string'],
            'grade_level_id' => ['required','uuid','exists:grade_levels,id'],
            'hours_per_week' => ['integer','min:1'],
            'color' => ['regex:/^#[0-9A-Fa-f]{6}$/']
        ];
    }
}
