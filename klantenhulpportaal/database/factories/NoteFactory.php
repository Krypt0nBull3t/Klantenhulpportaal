<?php

namespace Database\Factories;

use App\Models\Note;
use App\Models\User;
use App\Models\Ticket;
use Illuminate\Database\Eloquent\Factories\Factory;

class NoteFactory extends Factory
{
    protected $model = Note::class;

    public function definition(): array
    {
        // Get a random admin user, or create one if none exist
        $admin = User::query()->where('is_admin', true)->inRandomOrder()->first()
            ?? User::factory()->create(['is_admin' => true]);

        return [
            'ticket_id' => Ticket::factory(),
            'admin_id'  => $admin->id,
            'content'   => fake()->paragraph(),
        ];
    }
}
