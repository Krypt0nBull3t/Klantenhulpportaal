<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * @class UpdateTicketRequest
 * @description Validates data for updating an existing ticket.
 * Note: Controller must enforce that users can only update their own tickets, and only admins can assign tickets.
 */
class UpdateTicketRequest extends FormRequest
{
    /**
     * Authorize the request.
     * @function authorize
     * @returns {bool}
     */
    public function authorize(): bool
    {
        // Only authenticated users can update tickets; controller enforces ownership/admin
        return auth()->check();
    }

    /**
     * Get the validation rules that apply to the request.
     * @function rules
     * @returns {array}
     */
    public function rules(): array
    {
        $isAdmin = auth()->user() && auth()->user()->is_admin;

        return [
            'title' => ['sometimes', 'string', 'max:255'],
            'content' => ['sometimes', 'string'],
            'category_id' => ['sometimes', 'exists:categories,id'],
            'status' => ['sometimes', 'integer'],
            // Only allow assigned_to if user is admin
            'assigned_to' => $isAdmin
                ? ['sometimes', 'exists:users,id']
                : ['prohibited'],
            // user_id is not updatable by request
        ];
    }
}
