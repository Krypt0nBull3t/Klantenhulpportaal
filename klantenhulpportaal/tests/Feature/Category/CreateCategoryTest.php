<?php

namespace Tests\Feature\Category;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * @covers CategoryController::store
 */
class CreateCategoryTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test that an authenticated admin user can create a category.
     */
    public function test_authenticated_admin_can_create_category(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $this->actingAs($admin, 'sanctum');

        $response = $this->postJson('/api/categories', [
            'name' => 'Support',
        ]);

        $response->assertStatus(201)
            ->assertJsonFragment(['name' => 'Support']);
        $this->assertDatabaseHas('categories', ['name' => 'Support']);
    }

    /**
     * Test validation error if name is missing or not unique.
     */
    public function test_category_creation_requires_unique_name(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $this->actingAs($admin, 'sanctum');

        // Missing name
        $response = $this->postJson('/api/categories', []);
        $response->assertStatus(422)
            ->assertJsonValidationErrors('name');

        // Duplicate name
        $this->postJson('/api/categories', ['name' => 'Support']);
        $response = $this->postJson('/api/categories', ['name' => 'Support']);
        $response->assertStatus(422)
            ->assertJsonValidationErrors('name');
    }

    /**
     * Test that unauthenticated users cannot create categories.
     */
    public function test_unauthenticated_user_cannot_create_category(): void
    {
        $response = $this->postJson('/api/categories', ['name' => 'Support']);
        $response->assertStatus(401);
    }
}
