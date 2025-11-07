<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @class ReplyResource
 * @description Formats reply data for API responses.
 */
class ReplyResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     * @function toArray
     * @param {\Illuminate\Http\Request} $request
     * @returns {array}
     */
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'ticket_id' => $this->ticket_id,
            'user_id' => $this->user_id,
            'content' => $this->content,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
