<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use app\Models\User;
use app\Models\Category;

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
            'content' => fake()->paragraph(),
            'status' => fake()->numberBetween(0, 2),
            'user_id' => User::inRandomOrder()->first()->id,
            'assigned_to' => null,
            'category_id' => Category::inRandomOrder()->first()->id,
        ];
    }
}
