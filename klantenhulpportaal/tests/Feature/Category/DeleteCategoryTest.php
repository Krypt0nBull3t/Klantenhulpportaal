<?php

namespace Tests\Feature\Category;

use App\Models\Category;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DeleteCategoryTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function authenticated_admin_can_delete_category()
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $category = Category::factory()->create();
        $this->actingAs($admin, 'sanctum');
        $response = $this->deleteJson("/api/categories/{$category->id}");
        $response->assertStatus(204);
        $this->assertDatabaseMissing('categories', ['id' => $category->id]);
    }

    /** @test */
    public function unauthenticated_user_cannot_delete_category()
    {
        $category = Category::factory()->create();
        $response = $this->deleteJson("/api/categories/{$category->id}");
        $response->assertStatus(401);
    }

    /** @test */
    public function non_admin_user_cannot_delete_category()
    {
        $user = User::factory()->create(['is_admin' => false]);
        $category = Category::factory()->create();
        $this->actingAs($user, 'sanctum');
        $response = $this->deleteJson("/api/categories/{$category->id}");
        $response->assertStatus(403);
    }

    /** @test */
    public function category_not_found_returns_404()
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $this->actingAs($admin, 'sanctum');
        $response = $this->deleteJson("/api/categories/999999");
        $response->assertStatus(404);
    }
}
