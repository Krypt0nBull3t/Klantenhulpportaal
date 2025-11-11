<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Illuminate\Auth\Notifications\ResetPassword;
use Tests\TestCase;

class PasswordResetTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test requesting a password reset link with a valid email
     */
    public function test_can_request_password_reset_link_with_valid_email(): void
    {
        // Arrange
        Notification::fake();
        $user = User::factory()->create(['email' => 'test@example.com']);

        // Act
        $response = $this->postJson('/api/password/email', [
            'email' => 'test@example.com',
        ]);

        // Assert
        $response->assertStatus(200)
                 ->assertJson([
                     'message' => 'Password reset link sent'
                 ]);
        Notification::assertSentTo($user, ResetPassword::class);
    }

    /**
     * Test requesting a password reset link with an invalid email
     */
    public function test_cannot_request_password_reset_link_with_invalid_email(): void
    {
        // Arrange
        Notification::fake();
        $invalidEmail = 'nonexistent@example.com';

        // Act
        $response = $this->postJson('/api/password/email', [
            'email' => $invalidEmail,
        ]);

        // Assert
        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['email']);
        Notification::assertNothingSent();
    }

    /**
     * Test requesting a password reset link with missing or invalid email format
     */
    public function test_cannot_request_password_reset_link_with_missing_or_invalid_email(): void
    {
        // Arrange
        Notification::fake();

        // Act - Missing email
        $responseMissing = $this->postJson('/api/password/email', []);
        // Assert
        $responseMissing->assertStatus(422)
                        ->assertJsonValidationErrors(['email']);

        // Act - Invalid email format
        $responseInvalid = $this->postJson('/api/password/email', [
            'email' => 'not-an-email',
        ]);
        // Assert
        $responseInvalid->assertStatus(422)
                        ->assertJsonValidationErrors(['email']);
    }
}
