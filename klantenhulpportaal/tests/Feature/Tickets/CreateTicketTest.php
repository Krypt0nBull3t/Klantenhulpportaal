<?php

namespace Tests\Feature\Tickets;

use App\Models\User;
use App\Models\Category;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * @covers TicketController::store
 */
class CreateTicketTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test that any authenticated user can create a ticket.
     */
    public function test_authenticated_user_can_create_ticket(): void
    {
        $user = User::factory()->create();
        $category = Category::factory()->create();
        $this->actingAs($user, 'sanctum');

        $response = $this->postJson('/api/tickets', [
            'title' => 'Test Ticket',
            'content' => 'This is a test ticket.',
            'category_id' => $category->id,
        ]);

        $response->assertStatus(201)
            ->assertJsonFragment([
                'title' => 'Test Ticket',
                'content' => 'This is a test ticket.',
                'category_id' => $category->id,
            ]);
        $this->assertDatabaseHas('tickets', [
            'title' => 'Test Ticket',
            'content' => 'This is a test ticket.',
            'category_id' => $category->id,
        ]);
    }

    /**
     * Test validation error if title and category are missing.
     */
    public function test_ticket_creation_requires_title_and_category(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user, 'sanctum');

        $response = $this->postJson('/api/tickets', [
            'content' => 'Missing title and category.',
        ]);
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['title', 'category_id']);
    }

        /**
     * Test validation error if title is missing.
     */
    public function test_ticket_creation_requires_title(): void
    {
        $user = User::factory()->create();
        $category = Category::factory()->create();
        $this->actingAs($user, 'sanctum');

        $response = $this->postJson('/api/tickets', [
            'content' => 'Missing title.',
            'category_id' => $category->id,
        ]);
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['title']);
    }

    /**
     * Test validation error if category_id is missing.
     */
    public function test_ticket_creation_requires_category_id(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user, 'sanctum');

        $response = $this->postJson('/api/tickets', [
            'title' => 'Missing category',
            'content' => 'Missing category_id.',
        ]);
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['category_id']);
    }

    /**
     * Test that unauthenticated users cannot create tickets.
     */
    public function test_unauthenticated_user_cannot_create_ticket(): void
    {
        $category = Category::factory()->create();

        $response = $this->postJson('/api/tickets', [
            'title' => 'Test Ticket',
            'content' => 'This is a test ticket.',
            'category_id' => $category->id,
        ]);
        $response->assertStatus(401);
    }
}
