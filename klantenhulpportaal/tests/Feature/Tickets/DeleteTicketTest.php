<?php

namespace Tests\Feature\Tickets;

use App\Models\Category;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * @covers TicketController::destroy
 */
class DeleteTicketTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test that ticket owner can delete their own ticket.
     */
    public function test_ticket_owner_can_delete_their_ticket(): void
    {
        $user = User::factory()->create();
        $category = Category::factory()->create();
        $ticket = Ticket::factory()->create([
            'user_id' => $user->id,
            'category_id' => $category->id,
        ]);
        $this->actingAs($user, 'sanctum');

        $response = $this->deleteJson("/api/tickets/{$ticket->id}");

        $response->assertStatus(204);
        $this->assertDatabaseMissing('tickets', ['id' => $ticket->id]);
    }

    /**
     * Test that admin can delete any ticket.
     */
    public function test_admin_can_delete_any_ticket(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $user = User::factory()->create();
        $category = Category::factory()->create();
        $ticket = Ticket::factory()->create([
            'user_id' => $user->id,
            'category_id' => $category->id,
        ]);
        $this->actingAs($admin, 'sanctum');

        $response = $this->deleteJson("/api/tickets/{$ticket->id}");

        $response->assertStatus(204);
        $this->assertDatabaseMissing('tickets', ['id' => $ticket->id]);
    }



    /**
     * Test that user cannot delete another user's ticket.
     */
    public function test_user_cannot_delete_another_users_ticket(): void
    {
        $user1 = User::factory()->create(['is_admin' => false]);
        $user2 = User::factory()->create(['is_admin' => false]);
        $category = Category::factory()->create();
        $ticket = Ticket::factory()->create([
            'user_id' => $user1->id,
            'category_id' => $category->id,
        ]);
        $this->actingAs($user2, 'sanctum');

        $response = $this->deleteJson("/api/tickets/{$ticket->id}");

        $response->assertStatus(403);
        $this->assertDatabaseHas('tickets', ['id' => $ticket->id]);
    }

    /**
     * Test that unauthenticated users cannot delete tickets.
     */
    public function test_unauthenticated_user_cannot_delete_ticket(): void
    {
        $category = Category::factory()->create();
        $ticket = Ticket::factory()->create(['category_id' => $category->id]);

        $response = $this->deleteJson("/api/tickets/{$ticket->id}");

        $response->assertStatus(401);
    }

    /**
     * Test that 404 is returned if ticket does not exist.
     */
    public function test_ticket_not_found_returns_404(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user, 'sanctum');

        $response = $this->deleteJson('/api/tickets/99999');

        $response->assertStatus(404);
    }
}