<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use \App\Http\Resources\ReplyResource;

/**
 * @class TicketResource
 * @description Formats ticket data for API responses (direct fields only).
 */
class TicketResource extends JsonResource
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
            'title' => $this->title,
            'content' => $this->content,
            'status' => $this->status,
            'user_id' => $this->user_id,
            'assigned_to' => $this->assigned_to,
            'category_id' => $this->category_id,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'replies' => ReplyResource::collection($this->replies),
        ];
    }
}
