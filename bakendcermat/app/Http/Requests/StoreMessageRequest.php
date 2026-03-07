<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreMessageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'student_id' => ['required', 'uuid', 'exists:students,id'],
            'sender_role' => ['required', Rule::in(['teacher', 'guardian'])],
            'sender_id' => ['required', 'uuid', 'exists:profiles,id'],
            'content' => ['required', 'string'],
        ];
    }
}
