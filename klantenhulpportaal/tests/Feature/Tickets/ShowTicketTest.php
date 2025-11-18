<?php

namespace Tests\Feature\Tickets;

use App\Models\Category;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * @covers TicketController::show
 */
class ShowTicketTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test that ticket owner can view their own ticket.
     */
    public function test_ticket_owner_can_view_their_ticket(): void
    {
        $user = User::factory()->create();
        $category = Category::factory()->create();
        $ticket = Ticket::factory()->create([
            'title' => 'Test Ticket',
            'content' => 'Test content',
            'user_id' => $user->id,
            'category_id' => $category->id,
        ]);
        $this->actingAs($user, 'sanctum');

        $response = $this->getJson("/api/tickets/{$ticket->id}");

        $response->assertStatus(200)
            ->assertJsonFragment([
                'title' => 'Test Ticket',
                'content' => 'Test content',
            ]);
    }

    /**
     * Test that admin can view any ticket.
     */
    public function test_admin_can_view_any_ticket(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $user = User::factory()->create();
        $category = Category::factory()->create();
        $ticket = Ticket::factory()->create([
            'title' => 'User Ticket',
            'user_id' => $user->id,
            'category_id' => $category->id,
        ]);
        $this->actingAs($admin, 'sanctum');

        $response = $this->getJson("/api/tickets/{$ticket->id}");

        $response->assertStatus(200)
            ->assertJsonFragment(['title' => 'User Ticket']);
    }



    /**
     * Test that user cannot view another user's ticket.
     */
    public function test_user_cannot_view_another_users_ticket(): void
    {
        $user1 = User::factory()->create(['is_admin' => false]);
        $user2 = User::factory()->create(['is_admin' => false]);
        $category = Category::factory()->create();
        $ticket = Ticket::factory()->create([
            'user_id' => $user1->id,
            'category_id' => $category->id,
        ]);
        $this->actingAs($user2, 'sanctum');

        $response = $this->getJson("/api/tickets/{$ticket->id}");

        $response->assertStatus(403);
    }

    /**
     * Test that unauthenticated users cannot view tickets.
     */
    public function test_unauthenticated_user_cannot_view_ticket(): void
    {
        $category = Category::factory()->create();
        $ticket = Ticket::factory()->create(['category_id' => $category->id]);

        $response = $this->getJson("/api/tickets/{$ticket->id}");

        $response->assertStatus(401);
    }

    /**
     * Test that 404 is returned if ticket does not exist.
     */
    public function test_ticket_not_found_returns_404(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user, 'sanctum');

        $response = $this->getJson('/api/tickets/99999');

        $response->assertStatus(404);
    }
}