<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\CategoryController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Authentication routes
Route::middleware('web')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/password/email', [AuthController::class, 'sendPasswordResetLink']);
    Route::post('/register', [AuthController::class, 'register']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Email verification routes
    Route::get('/email/verify/{id}/{hash}', [AuthController::class, 'verify'])->name('verification.verify');
    Route::post('/email/resend', [AuthController::class, 'resendVerification'])->name('verification.resend');
});

// Protected API routes (auth:sanctum)
Route::middleware('auth:sanctum')->group(function () {
    /**
     * Category management endpoints (admin-only).
     */
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::get('/categories/{category}', [CategoryController::class, 'show']);
    Route::put('/categories/{category}', [CategoryController::class, 'update']);
    Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);
    // Future: Route::get('/categories', ...) etc.
});