<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateGradeLevelRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('grade_level')->id ?? null;

        return [
            'level' => ['string'],
            'grade' => [
                'integer',
                Rule::unique('grade_levels')
                    ->where(fn($q)=>$q->where('level',$this->level))
                    ->ignore($id)
            ],
            'name' => ['string']
        ];
    }
}
