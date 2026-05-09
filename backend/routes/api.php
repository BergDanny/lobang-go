<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Quest\QuestController;
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

        Route::prefix('quests')->controller(QuestController::class)->group(function () {
            Route::get('posted', 'posted');
            Route::get('taken', 'taken');
            Route::post('{quest}/take', 'take_quest');
        });

        Route::apiResource('quests', QuestController::class);
    });
});
