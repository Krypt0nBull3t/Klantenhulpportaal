<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // Create test user

        User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'is_admin' => true,
        ]);
        User::factory()->count(1)->create(['is_admin' => true]);

        $this->call([
            UserSeeder::class,
            CategorySeeder::class,
            TicketSeeder::class,
            NoteSeeder::class,
            ReplySeeder::class,
        ]);
    }
}
