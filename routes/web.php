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

    //-----------------------------------------
    // Inscription Routes
    //-----------------------------------------

    Route::get('/inscriptions', function(){
        return Inertia::render('AdminPages/Inscriptions');     
    });

    //-----------------------------------------
    // Dashboard & Inscription Management Routes
    //-----------------------------------------

    Route::get('/dashboard', function(){
        return Inertia::render('AdminPages/Dashboard');     
    });


    //-----------------------------------------
    // Our Inscription CRUD Routes
    //-----------------------------------------

    Route::get('/ourinscription', [InscriptionController::class, 'index'])->name('ourinscription.index');
    Route::post('/ourinscription', [InscriptionController::class, 'store'])->name('ourinscription.store');
    Route::put('/ourinscription/{id}', [InscriptionController::class, 'update'])->name('ourinscription.update');
    Route::delete('/ourinscription/{id}', [InscriptionController::class, 'destroy'])->name('ourinscription.destroy');
    Route::delete('/ourinscription/image/{id}', [InscriptionController::class, 'destroyImage'])->name('ourinscription.destroyImage');


    //-----------------------------------------
    // Test Upload Limits Route
    //-----------------------------------------
 
    Route::get('/test-upload-limits', function() {
    return response()->json([
        'success' => true,
        'limits' => [
            'upload_max_filesize' => ini_get('upload_max_filesize'),
            'post_max_size' => ini_get('post_max_size'),
            'max_execution_time' => ini_get('max_execution_time'),
            'max_input_time' => ini_get('max_input_time'),
            'memory_limit' => ini_get('memory_limit'),
        ],
        'request_method' => request()->method(),
        'middleware_applied' => true,
    ]);
});


require __DIR__.'/auth.php';
