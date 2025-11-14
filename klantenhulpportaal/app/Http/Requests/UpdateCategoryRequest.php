<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * @class UpdateCategoryRequest
 * @description Validates data for updating an existing category (admin-only).
 */
class UpdateCategoryRequest extends FormRequest
{
    /**
     * Authorize the request.
     * @function authorize
     * @returns bool
     */
    public function authorize(): bool
    {
        // Only admins can update categories
        return auth()->check() && auth()->user()->is_admin;
    }

    /**
     * Get the validation rules that apply to the request.
     * @function rules
     * @returns array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'max:255',
                'unique:categories,name,' . $this->route('category')->id,
            ],
        ];
    }
}
