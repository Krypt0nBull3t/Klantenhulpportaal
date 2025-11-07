<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * @class UpdateReplyRequest
 * @description Validates data for updating an existing reply.
 */
class UpdateReplyRequest extends FormRequest
{
    /**
     * Authorize the request.
     * @function authorize
     * @returns {bool}
     */
    public function authorize(): bool
    {
        // Only authenticated users can update replies; controller enforces ownership/admin
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
            'content' => ['sometimes', 'string'],
            // ticket_id and user_id are not updatable by request
        ];
    }
}
