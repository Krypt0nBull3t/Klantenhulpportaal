<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Auth\Events\Verified;
use Illuminate\Support\Facades\Notification;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Support\Facades\URL;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use App\Http\Requests\Auth\SendPasswordResetLinkRequest;
use App\Http\Requests\Auth\RegisterUserRequest;


/**
 * Authentication Controller
 * 
 * Handles user authentication operations including login, logout,
 * and related authentication functionality for the API.
 */
class AuthController extends Controller
{
    /**
     * Register a new user.
     *
     * @param RegisterUserRequest $request Validated registration request.
     * @return JsonResponse JSON response with user data.
     */
    public function register(RegisterUserRequest $request): JsonResponse
    {
        $user = User::create([
            'name' => $request->input('name'),
            'email' => $request->input('email'),
            'password' => Hash::make($request->input('password')),
        ]);

        // Send email verification notification
        $user->sendEmailVerificationNotification();

        return response()->json([
            'message' => 'Registration successful. Please check your email to verify your account.',
            'user' => new UserResource($user)
        ], 201);
    }

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
        // Block login if email not verified
        if (!$user->hasVerifiedEmail()) {
            Auth::logout();
            return response()->json([
                'message' => 'Please verify your email before logging in.'
            ], 403);
        }

        // Return success response with user data
        return response()->json([
            'message' => 'Login successful',
            'user' => new UserResource($user)
        ], 200);

    }

    /**
     * Verify user's email address.
     * @param Request $request
     * @return JsonResponse
     */
    public function verify(Request $request): JsonResponse
    {
        $user = User::find($request->route('id'));
        if (!$user) {
            return response()->json(['message' => 'User not found.'], 404);
        }
        // Check hash
        if (!hash_equals((string) $request->route('hash'), sha1($user->email))) {
            return response()->json(['message' => 'Invalid or expired verification link.'], 403);
        }
        if ($user->hasVerifiedEmail()) {
            return response()->json(['message' => 'Email already verified.'], 200);
        }
        $user->markEmailAsVerified();
        event(new Verified($user));
        return response()->json(['message' => 'Email verified successfully.'], 200);
    }

    /**
     * Resend email verification notification.
     * @param Request $request
     * @return JsonResponse
     */
    public function resendVerification(Request $request): JsonResponse
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'User not authenticated.'], 401);
        }
        if ($user->hasVerifiedEmail()) {
            return response()->json(['message' => 'Email already verified.'], 200);
        }
        $user->sendEmailVerificationNotification();
        return response()->json(['message' => 'Verification email resent.'], 200);
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