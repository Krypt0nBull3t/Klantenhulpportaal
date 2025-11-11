<?php

use App\Http\Controllers\Auth\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
// Authentication routes
Route::middleware('web')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/password/email', [AuthController::class, 'sendPasswordResetLink']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});