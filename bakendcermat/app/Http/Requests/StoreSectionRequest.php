<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreSectionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'academic_year_id' => ['required','uuid','exists:academic_years,id'],
            'grade_level_id' => ['required','uuid','exists:grade_levels,id'],
            'section_letter' => [
                'required','string',
                Rule::unique('sections')
                    ->where(fn($q)=>
                        $q->where('academic_year_id',$this->academic_year_id)
                          ->where('grade_level_id',$this->grade_level_id)
                    )
            ],
            'capacity' => ['integer','min:1']
        ];
    }
}
