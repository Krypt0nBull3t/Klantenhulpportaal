<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Reply;

/**
 * @class ReplySeeder
 * @description Seeds the replies table with test data using the Reply factory.
 */
class ReplySeeder extends Seeder
{
    /**
     * Run the database seeds.
     * @function run
     * @returns {void}
     */
    public function run(): void
    {
        // Create 40 replies using the factory
        Reply::factory()->count(40)->create();
    }
}
