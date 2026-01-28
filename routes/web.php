<?php

use App\Http\Controllers\ActivityLogController;
use App\Http\Controllers\InscriptionController;
use App\Http\Controllers\UserController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Route::get('/', function () {
//     return Inertia::render('Welcome', [
//         'canLogin' => Route::has('login'),
//         'canRegister' => Route::has('register'),
//         'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//     ]);
// });

// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {

    // -----------------------------------------
    // Inscription Routes
    // -----------------------------------------

    Route::get('/inscriptions', function () {
        return Inertia::render('AdminPages/Inscriptions');
    });

    // -----------------------------------------
    // Dashboard & Inscription Management Routes
    // -----------------------------------------

    Route::get('/', function () {
        return Inertia::render('AdminPages/Dashboard');
    });

    Route::get('/user-management', function () {
        return Inertia::render('AdminPages/UserManagement');
    });

    Route::get('/activity-log', function () {
        return Inertia::render('AdminPages/ActivityLog');
    });

    // Route::get('/inscription-details', function(){
    //     return Inertia::render('AdminPages/InscriptionPage');
    // });

    Route::get('/inscription-details', function () {
        return Inertia::render('MainPages/InscriptionPage');
    });

});
Route::get('/loginpage', function () {
    return Inertia::render('MainPages/Login');
});

Route::get('/ourlogs.index', [ActivityLogController::class, 'index'])->name('ourlogs.index');

Route::get('/ouruser', [UserController::class, 'index'])->name('ouruser.index');
Route::post('/ouruser', [UserController::class, 'store'])->name('ouruser.store');
Route::put('/ouruser/{id}', [UserController::class, 'update'])->name('ouruser.update');
Route::delete('/ouruser/{id}', [UserController::class, 'destroy'])->name('ouruser.destroy');

// routes/web.php
Route::get('/inscription-details/{slug}', [InscriptionController::class, 'showDetails'])->name('inscription.showDetails');

// -----------------------------------------
// Our Inscription CRUD Routes
// -----------------------------------------


Route::post('/ourinscription', [InscriptionController::class, 'store'])->name('ourinscription.store');
Route::put('/ourinscription/{id}', [InscriptionController::class, 'update'])->name('ourinscription.update');
Route::delete('/ourinscription/{id}', [InscriptionController::class, 'destroy'])->name('ourinscription.destroy');
Route::delete('/ourinscription/image/{id}', [InscriptionController::class, 'destroyImage'])->name('ourinscription.destroyImage');

// -----------------------------------------
// Test Upload Limits Route
// -----------------------------------------

Route::get('/test-upload-limits', function () {
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

Route::get('/ourinscription', [InscriptionController::class, 'index'])->name('ourinscription.index');

require __DIR__.'/auth.php';
