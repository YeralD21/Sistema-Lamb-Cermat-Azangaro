<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAcademicYearRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'year' => ['required','integer','unique:academic_years,year'],
            'start_date' => ['required','date'],
            'end_date' => ['required','date','after:start_date'],
            'is_active' => ['boolean']
        ];
    }
}
