<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use App\Http\Requests\Auth\SendPasswordResetLinkRequest;

/**
 * Authentication Controller
 * 
 * Handles user authentication operations including login, logout,
 * and related authentication functionality for the API.
 */
class AuthController extends Controller
{
    /**
     * Send password reset link to user's email.
     *
     * @param SendPasswordResetLinkRequest $request Validated request containing the user's email.
     * @return JsonResponse JSON response indicating success or failure.
     */
    public function sendPasswordResetLink(SendPasswordResetLinkRequest $request): JsonResponse
    {
        $status = Password::sendResetLink($request->only('email'));

        if ($status === Password::RESET_LINK_SENT) {
            return response()->json(['message' => 'Password reset link sent'], 200);
        }

        return response()->json(['message' => 'Unable to send reset link'], 500);
    }
    /**
     * Handle user login request
     * 
     * Authenticates user with email and password, returns user data
     * and establishes session for SPA authentication.
     * 
     * @param LoginRequest $request Validated login request
     * @return JsonResponse
     */
    public function login(LoginRequest $request): JsonResponse
    {
        // Get validated credentials
        $credentials = $request->validated();

        // Attempt to log in using session-based authentication
        if (!Auth::attempt($credentials)) {
            return response()->json([
                'message' => 'Invalid credentials'
            ], 401);
        }

        // Regenerate session to prevent fixation
        $request->session()->regenerate();

        $user = Auth::user();
        // Return success response with user data
        return response()->json([
            'message' => 'Login successful',
            'user' => new UserResource($user)
        ], 200);
    }

    /**
     * Handle user logout request
     * 
     * Revokes the user's current access token and logs out.
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function logout(Request $request): JsonResponse
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'message' => 'Logout successful'
        ], 200);
    }
}