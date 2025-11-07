<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Ticket;

/**
 * @class TicketSeeder
 * @description Seeds the tickets table with test data using the Ticket factory.
 */
class TicketSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * @function run
     * @returns {void}
     */
    public function run(): void
    {
        // Create 20 tickets using the factory
        Ticket::factory()->count(20)->create();
    }
}
