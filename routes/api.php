<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ChildCategoryController;
use App\Http\Controllers\InscriptionController;
use App\Http\Controllers\PalaeographicalController;
use App\Http\Controllers\SubCategoryController;
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

// -----------------------------------------
// Inscription Search Route
// -----------------------------------------

Route::get('/palaeographical', [PalaeographicalController::class, 'index']);

// -----------------------------------------
// SubCategory API Routes
// -----------------------------------------

Route::get('/sub_categories', [SubCategoryController::class, 'index']);

// -----------------------------------------
// Category API Routes
// -----------------------------------------

Route::get('/categories', [CategoryController::class, 'index']);

// -----------------------------------------
// Child Category API Routes
// -----------------------------------------
Route::get('/child_categories', [ChildCategoryController::class, 'index']);
