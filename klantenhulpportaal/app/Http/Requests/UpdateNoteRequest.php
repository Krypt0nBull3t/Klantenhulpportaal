<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * @class UpdateNoteRequest
 * @description Validates data for updating an existing note (admin-only).
 */
class UpdateNoteRequest extends FormRequest
{
    /**
     * Authorize the request.
     * @function authorize
     * @returns {bool}
     */
    public function authorize(): bool
    {
        // Only admins can update notes
        return auth()->check() && auth()->user()->is_admin;
    }

    /**
     * Get the validation rules that apply to the request.
     * @function rules
     * @returns {array}
     */
    public function rules(): array
    {
        return [
            'content' => ['sometimes', 'string'],
            // ticket_id and admin_id are not updatable by request
        ];
    }
}
