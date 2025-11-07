<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * @class StoreNoteRequest
 * @description Validates data for creating a new note (admin-only).
 */
class StoreNoteRequest extends FormRequest
{
    /**
     * Authorize the request.
     * @function authorize
     * @returns {bool}
     */
    public function authorize(): bool
    {
        // Only admins can create notes
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
            'ticket_id' => ['required', 'exists:tickets,id'],
            'content' => ['required', 'string'],
        ];
    }
}
