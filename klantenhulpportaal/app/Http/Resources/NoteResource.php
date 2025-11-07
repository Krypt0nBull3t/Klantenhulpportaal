<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @class NoteResource
 * @description Formats note data for API responses (admin-only visibility).
 *
 * @property int $id
 * @property int $ticket_id
 * @property int $admin_id
 * @property string $content
 * @property string $created_at
 * @property string $updated_at
 */
class NoteResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @function toArray
     * @param \Illuminate\Http\Request $request
     * @return array<string, mixed>
     */
    public function toArray($request)
    {
        return [
            'id'         => $this->id,
            'ticket_id'  => $this->ticket_id,
            'admin_id'   => $this->admin_id,
            'content'    => $this->content,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
