<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

/**
 * @class CategorySeeder
 * @description Seeds the categories table with example data.
 */
class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     * @function run
     * @returns void
     */
    public function run(): void
    {
        // Example categories for support tickets
        $categories = [
            'General Inquiry',
            'Technical Support',
            'Billing',
            'Account Management',
            'Feedback',
        ];

        foreach ($categories as $name) {
            Category::create(['name' => $name]);
        }
    }
}
