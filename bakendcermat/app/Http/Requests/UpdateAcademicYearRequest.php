<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateAcademicYearRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('academic_year')->id ?? null;

        return [
            'year' => ['integer', Rule::unique('academic_years','year')->ignore($id)],
            'start_date' => ['date'],
            'end_date' => ['date','after:start_date'],
            'is_active' => ['boolean']
        ];
    }
}
