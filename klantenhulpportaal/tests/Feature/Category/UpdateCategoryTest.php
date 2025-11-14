<?php

namespace Tests\Feature\Category;

use App\Models\Category;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * @covers CategoryController::update
 */
class UpdateCategoryTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test that an authenticated admin can update a category.
     */
    public function test_authenticated_admin_can_update_category(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $this->actingAs($admin, 'sanctum');
        $category = Category::factory()->create(['name' => 'General']);

        $response = $this->putJson("/api/categories/{$category->id}", [
            'name' => 'Support',
        ]);

        $response->assertStatus(200)
            ->assertJsonFragment(['name' => 'Support']);
        $this->assertDatabaseHas('categories', ['id' => $category->id, 'name' => 'Support']);
    }

    /**
     * Test validation error if name is missing or not unique.
     */
    public function test_category_update_requires_unique_name(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $this->actingAs($admin, 'sanctum');
        $category1 = Category::factory()->create(['name' => 'General']);
        $category2 = Category::factory()->create(['name' => 'Support']);

        // Missing name
        $response = $this->putJson("/api/categories/{$category1->id}", []);
        $response->assertStatus(422)
            ->assertJsonValidationErrors('name');

        // Duplicate name
        $response = $this->putJson("/api/categories/{$category1->id}", ['name' => 'Support']);
        $response->assertStatus(422)
            ->assertJsonValidationErrors('name');
    }

    /**
     * Test that unauthenticated users cannot update a category.
     */
    public function test_unauthenticated_user_cannot_update_category(): void
    {
        $category = Category::factory()->create(['name' => 'General']);
        $response = $this->putJson("/api/categories/{$category->id}", ['name' => 'Support']);
        $response->assertStatus(401);
    }

    /**
     * Test that non-admin users cannot update a category.
     */
    public function test_non_admin_user_cannot_update_category(): void
    {
        $user = User::factory()->create(['is_admin' => false]);
        $this->actingAs($user, 'sanctum');
        $category = Category::factory()->create(['name' => 'General']);
        $response = $this->putJson("/api/categories/{$category->id}", ['name' => 'Support']);
        $response->assertStatus(403);
    }

    /**
     * Test that a 404 is returned if the category does not exist.
     */
    public function test_category_not_found_returns_404(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $this->actingAs($admin, 'sanctum');
        $response = $this->putJson('/api/categories/99999', ['name' => 'Support']);
        $response->assertStatus(404);
    }
}
