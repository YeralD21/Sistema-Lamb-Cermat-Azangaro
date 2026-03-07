<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreGradeLevelRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'level' => ['required','string'],
            'grade' => [
                'required','integer',
                Rule::unique('grade_levels')->where(fn($q)=>
                    $q->where('level',$this->level)
                )
            ],
            'name' => ['required','string']
        ];
    }
}
