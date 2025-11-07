<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * @class StoreReplyRequest
 * @description Validates data for creating a new reply.
 */
class StoreReplyRequest extends FormRequest
{
    /**
     * Authorize the request.
     * @function authorize
     * @returns {bool}
     */
    public function authorize(): bool
    {
        // Only authenticated users can create replies
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
            'ticket_id' => ['required', 'exists:tickets,id'],
            'content' => ['required', 'string'],
        ];
    }
}
