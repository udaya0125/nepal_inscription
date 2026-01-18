<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\InscriptionController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::get('/inscriptions', function(){
        return Inertia::render('AdminPages/Inscriptions');     
});

Route::get('/dashboard', function(){
        return Inertia::render('AdminPages/Dashboard');     
});

    Route::get('/ourinscription', [InscriptionController::class, 'index'])->name('ourinscription.index');
    Route::post('/ourinscription', [InscriptionController::class, 'store'])->name('ourinscription.store');
    Route::put('/ourinscription/{id}', [InscriptionController::class, 'update'])->name('ourinscription.update');
    Route::delete('/ourinscription/{id}', [InscriptionController::class, 'destroy'])->name('ourinscription.destroy');
    Route::get('/ourinscription/{id}', [InscriptionController::class, 'destroyImage'])->name('ourinscription.destroyImage');

require __DIR__.'/auth.php';
