<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Ticket>
 */
class TicketFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => fake()->sentence(),
            'description' => fake()->paragraph(),
            'status' => fake()->randomElement(['In afwachting', 'In behandeling', 'Afgehandeld']),
            'user_id' => \App\Models\User::factory(),
            'assigned_to' => null,
            'category_id' => \App\Models\Category::factory(),
        ];
    }
}
