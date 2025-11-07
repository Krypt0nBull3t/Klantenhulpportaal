<?php

namespace Database\Factories;

use App\Models\Reply;
use Illuminate\Database\Eloquent\Factories\Factory;

class ReplyFactory extends Factory
{
    protected $model = Reply::class;

    public function definition(): array
    {
        return [
            'ticket_id' => \App\Models\Ticket::inRandomOrder()->first()->id ?? \App\Models\Ticket::factory(),
            'user_id'   => \App\Models\User::inRandomOrder()->first()->id ?? \App\Models\User::factory(),
            'content'   => fake()->paragraph(),
        ];
    }
}
