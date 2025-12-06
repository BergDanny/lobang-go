<?php

use App\Http\Controllers\Auth\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::middleware('guest')->group(function () {
        Route::prefix('auth')->controller(AuthController::class)->group(function () {
            Route::post('register', 'register');
            Route::post('login', 'login');
        });
    });

    Route::middleware('auth:sanctum')->group(function () {
        Route::prefix('auth')->controller(AuthController::class)->group(function () {
            Route::delete('/logout', 'logout');
        });
    });
});
