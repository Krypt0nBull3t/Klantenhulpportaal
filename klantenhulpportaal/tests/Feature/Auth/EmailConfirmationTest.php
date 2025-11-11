<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Auth\Events\Verified;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Notification;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Support\Facades\URL;
use Tests\TestCase;

class EmailConfirmationTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test user receives a verification email after registration.
     */
    public function test_user_receives_verification_email_after_registration(): void
    {
        // Arrange
        Notification::fake();

        $payload = [
            'name' => 'Unverified User',
            'email' => 'unverified@example.com',
            'password' => 'securePassword123',
            'password_confirmation' => 'securePassword123',
        ];

        // Act
        $response = $this->postJson('/api/register', $payload);

        // Assert
        $response->assertStatus(201);
        $user = User::where('email', 'unverified@example.com')->first();
        Notification::assertSentTo($user, VerifyEmail::class);
        $this->assertNull($user->email_verified_at);
    }

    /**
     * Test user cannot log in before verifying email.
     */
    public function test_user_cannot_login_before_email_verification(): void
    {
        // Arrange
        $user = User::factory()->create([
            'email' => 'unverified@example.com',
            'password' => bcrypt('securePassword123'),
            'email_verified_at' => null,
        ]);

        // Act
        $response = $this->postJson('/api/login', [
            'email' => 'unverified@example.com',
            'password' => 'securePassword123',
        ]);

        // Assert
        $response->assertStatus(403)
                 ->assertJson(['message' => 'Please verify your email before logging in.']);
    }

    /**
     * Test user can verify email using the verification link.
     */
    public function test_user_can_verify_email(): void
    {
        // Arrange
        Event::fake();
        $user = User::factory()->create([
            'email_verified_at' => null,
        ]);
        $verificationUrl = URL::temporarySignedRoute(
            'verification.verify',
            now()->addMinutes(60),
            ['id' => $user->id, 'hash' => sha1($user->email)]
        );

        // Act
        $response = $this->getJson($verificationUrl);

        // Assert
        $response->assertStatus(200)
                 ->assertJson(['message' => 'Email verified successfully.']);
        $this->assertNotNull($user->fresh()->email_verified_at);
        Event::assertDispatched(Verified::class);
    }

    /**
     * Test verification fails with invalid or expired link.
     */
    public function test_verification_fails_with_invalid_or_expired_link(): void
    {
        // Arrange
        $user = User::factory()->create([
            'email_verified_at' => null,
        ]);
        $invalidUrl = '/api/email/verify/' . $user->id . '/invalidhash';

        // Act
        $response = $this->getJson($invalidUrl);

        // Assert
        $response->assertStatus(403)
                 ->assertJson(['message' => 'Invalid or expired verification link.']);
        $this->assertNull($user->fresh()->email_verified_at);
    }
}
