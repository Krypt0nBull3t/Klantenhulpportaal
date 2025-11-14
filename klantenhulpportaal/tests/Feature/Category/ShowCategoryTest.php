<?php

namespace Tests\Feature\Category;

use App\Models\Category;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * @covers CategoryController::show
 */
class ShowCategoryTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test that an authenticated user can view a category by ID.
     */
    public function test_authenticated_user_can_view_category(): void
    {
        $user = User::factory()->create(['is_admin' => true]);
        $this->actingAs($user, 'sanctum');
        $category = Category::factory()->create(['name' => 'General']);

        $response = $this->getJson("/api/categories/{$category->id}");

        $response->assertStatus(200)
            ->assertJsonFragment(['name' => 'General']);
    }

    /**
     * Test that a 404 is returned if the category does not exist.
     */
    public function test_category_not_found_returns_404(): void
    {
        $user = User::factory()->create(['is_admin' => true]);
        $this->actingAs($user, 'sanctum');

        $response = $this->getJson('/api/categories/99999');
        echo 'Returned status: ' . $response->getStatusCode() . PHP_EOL;
        $response->assertStatus(404);
    }

    /**
     * Test that unauthenticated users cannot view a category.
     */
    public function test_unauthenticated_user_cannot_view_category(): void
    {
        $category = Category::factory()->create(['name' => 'General']);
        $response = $this->getJson("/api/categories/{$category->id}");
        $response->assertStatus(401);
    }
}
