<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

/**
 * Login Endpoint Tests
 * 
 * Tests for the POST /api/login endpoint to ensure proper authentication,
 * validation, and response handling for user login functionality.
 */
class LoginTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test successful login with valid credentials
     */
    public function test_user_can_login_with_valid_credentials(): void
    {
        // Arrange
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => Hash::make('password123'),
        ]);

        // Act
        $response = $this->postJson('/api/login', [
            'email' => 'test@example.com',
            'password' => 'password123',
        ]);

        // Assert
        $response->assertStatus(200)
                ->assertJsonStructure([
                    'message',
                    'user' => [
                        'id',
                        'name',
                        'email',
                        'is_admin',
                    ]
                ]);
        
        $this->assertAuthenticatedAs($user);
    }

    /**
     * Test login fails with invalid email
     */
    public function test_login_fails_with_invalid_email(): void
    {
        // Arrange
        User::factory()->create([
            'email' => 'test@example.com',
            'password' => Hash::make('password123'),
        ]);

        // Act
        $response = $this->postJson('/api/login', [
            'email' => 'wrong@example.com',
            'password' => 'password123',
        ]);

        // Assert
        $response->assertStatus(401)
                ->assertJson([
                    'message' => 'Invalid credentials'
                ]);
        
        $this->assertGuest();
    }

    /**
     * Test login fails with invalid password
     */
    public function test_login_fails_with_invalid_password(): void
    {
        // Arrange
        User::factory()->create([
            'email' => 'test@example.com',
            'password' => Hash::make('password123'),
        ]);

        // Act
        $response = $this->postJson('/api/login', [
            'email' => 'test@example.com',
            'password' => 'wrongpassword',
        ]);

        // Assert
        $response->assertStatus(401)
                ->assertJson([
                    'message' => 'Invalid credentials'
                ]);
        
        $this->assertGuest();
    }

    /**
     * Test login validation requires email field
     */
    public function test_login_validation_requires_email(): void
    {
        // Act
        $response = $this->postJson('/api/login', [
            'password' => 'password123',
        ]);

        // Assert
        $response->assertStatus(422)
                ->assertJsonValidationErrors(['email']);
    }

    /**
     * Test login validation requires password field
     */
    public function test_login_validation_requires_password(): void
    {
        // Act
        $response = $this->postJson('/api/login', [
            'email' => 'test@example.com',
        ]);

        // Assert
        $response->assertStatus(422)
                ->assertJsonValidationErrors(['password']);
    }

    /**
     * Test login validation requires valid email format
     */
    public function test_login_validation_requires_valid_email_format(): void
    {
        // Act
        $response = $this->postJson('/api/login', [
            'email' => 'invalid-email',
            'password' => 'password123',
        ]);

        // Assert
        $response->assertStatus(422)
                ->assertJsonValidationErrors(['email']);
    }
}