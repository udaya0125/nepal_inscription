<?php

use App\Http\Controllers\InscriptionController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\SubCategoryController;
use App\Http\Controllers\PalaeographicalController;

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

    Route::get('/palaeographical', [PalaeographicalController ::class, 'index']);


    Route::get('/oursubcategories', [SubCategoryController::class, 'index']);

    // -----------------------------------------
    // Category API Routes
    // -----------------------------------------

    Route::get('/ourcategories', [CategoryController::class, 'index']);