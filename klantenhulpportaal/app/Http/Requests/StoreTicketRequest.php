<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * @class StoreTicketRequest
 * @description Validates data for creating a new ticket.
 */
class StoreTicketRequest extends FormRequest
{
    /**
     * Authorize the request.
     * @function authorize
     * @returns {bool}
     */
    public function authorize(): bool
    {
        // Only authenticated users can create tickets
        return auth()->check();
    }

    /**
     * Get the validation rules that apply to the request.
     * @function rules
     * @returns {array}
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string'],
            'category_id' => ['required', 'exists:categories,id'],
            // status, assigned_to, and user_id are set by backend logic
        ];
    }
}
