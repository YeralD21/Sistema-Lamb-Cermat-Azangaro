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
        // 'academic_year' es el nombre automático que genera apiResource
        // para la ruta: Route::apiResource('academic-years', ...)
        // URL: PUT /api/academic-years/{academic_year}
        $id = $this->route('academic_year');

        return [
            'year'       => ['required', 'integer', 'min:1900', 'max:2100',
                              Rule::unique('academic_years', 'year')->ignore($id)],
            'start_date' => ['required', 'date'],
            'end_date'   => ['required', 'date', 'after:start_date'],
            'is_active'  => ['boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'year.required'       => 'El año es requerido.',
            'year.integer'        => 'El año debe ser un número entero.',
            'year.min'            => 'El año no puede ser menor a 1900.',
            'year.max'            => 'El año no puede ser mayor a 2100.',
            'year.unique'         => 'Ese año académico ya existe.',
            'start_date.required' => 'La fecha de inicio es requerida.',
            'start_date.date'     => 'La fecha de inicio no es válida.',
            'end_date.required'   => 'La fecha de fin es requerida.',
            'end_date.date'       => 'La fecha de fin no es válida.',
            'end_date.after'      => 'La fecha de fin debe ser posterior a la de inicio.',
        ];
    }
}