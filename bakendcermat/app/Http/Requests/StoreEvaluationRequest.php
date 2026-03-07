<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreEvaluationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'student_id'    => ['required', 'uuid', 'exists:students,id'],
            'course_id'     => ['required', 'uuid', 'exists:courses,id'],
            'competency_id' => ['required', 'uuid', 'exists:competencies,id'],
            'period_id'     => ['required', 'uuid', 'exists:periods,id'],

            'grade'  => ['required', 'string', Rule::in(['AD','A','B','C'])],
            'status' => ['required', 'string', Rule::in(['borrador','publicada','cerrada'])],

            'comments' => ['nullable', 'string', 'max:2000'],
        ];
    }

    public function messages(): array
    {
        return [
            'grade.in'  => 'La nota debe ser AD, A, B o C.',
            'status.in' => 'El estado debe ser borrador, publicada o cerrada.',
        ];
    }
}
