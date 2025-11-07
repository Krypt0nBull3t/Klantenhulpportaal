<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Note;

/**
 * @class NoteSeeder
 * @description Seeds the notes table with test data using the Note factory.
 */
class NoteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * @function run
     * @returns {void}
     */
    public function run(): void
    {
        // Create 30 notes using the factory
        Note::factory()->count(30)->create();
    }
}
