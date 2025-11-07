<?php

namespace Database\Factories;

use App\Models\Reply;
use App\Models\User;
use App\Models\Ticket;
use Illuminate\Database\Eloquent\Factories\Factory;

class ReplyFactory extends Factory
{
    protected $model = Reply::class;

    public function definition(): array
    {
        $ticket = Ticket::inRandomOrder()->first() ?? Ticket::factory()->create();

        // Get ticket owner
        $ownerId = $ticket->user_id;

        // Get a random admin user
        $admin = User::where('is_admin', true)->inRandomOrder()->first();

        // Randomly pick either the owner or an admin
        $userId = fake()->boolean() && $admin ? $admin->id : $ownerId;

        return [
            'ticket_id' => $ticket->id,
            'user_id'   => $userId,
            'content'   => fake()->paragraph(),
        ];
    }
}
