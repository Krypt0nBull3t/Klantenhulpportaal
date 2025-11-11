<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;


/**
 * Logout Endpoint Tests
 * 
 * Tests for the POST /api/logout endpoint to ensure proper token revocation
 * and response handling for user logout functionality.
 */
class LogoutTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test successful logout for authenticated user
     */
    public function test_user_can_logout_successfully(): void
    {
        // Arrange
            $user = User::factory()->create();
            $this->actingAs($user); // Use session-based authentication

        // Act
            $response = $this->postJson('/api/logout');

        // Assert
            $response->assertStatus(200)
                     ->assertJson([
                         'message' => 'Logout successful'
                     ]);
            $this->assertGuest();
    }
}
