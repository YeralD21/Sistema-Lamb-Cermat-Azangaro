<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSectionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('section')->id ?? null;

        return [
            'academic_year_id' => ['uuid','exists:academic_years,id'],
            'grade_level_id' => ['uuid','exists:grade_levels,id'],
            'section_letter' => [
                'string',
                Rule::unique('sections')
                    ->where(fn($q)=>
                        $q->where('academic_year_id',$this->academic_year_id)
                          ->where('grade_level_id',$this->grade_level_id)
                    )
                    ->ignore($id)
            ],
            'capacity' => ['integer','min:1']
        ];
    }
}
