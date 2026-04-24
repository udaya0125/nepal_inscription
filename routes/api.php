<?php

use App\Http\Controllers\InscriptionController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// -----------------------------------------
// Inscription API Routes
// -----------------------------------------

Route::get('/inscriptions', [InscriptionController::class, 'index']);

// -----------------------------------------
// Inscription Details by Slug
// -----------------------------------------

Route::get('/{slug}/details', [InscriptionController::class, 'showBySlug']);
