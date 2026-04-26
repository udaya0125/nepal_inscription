<?php

use App\Http\Controllers\ActivityLogController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\InscriptionController;
use App\Http\Controllers\UserController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Spatie\Analytics\Facades\Analytics;
use Spatie\Analytics\Period;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\SubCategoryController;
use App\Http\Controllers\PalaeographicalController;

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

    // -----------------------------------------
    // User Management  Routes
    // -----------------------------------------

    Route::get('/user-management', function () {
        return Inertia::render('AdminPages/UserManagement');
    });

    // -----------------------------------------
    // Activity Log Route
    // -----------------------------------------

    Route::get('/activity-log', function () {
        return Inertia::render('AdminPages/ActivityLog');
    });

    // -----------------------------------------
    // Inscription Details Route for Admin Pages
    // -----------------------------------------

    // Route::get('/inscription-details', function(){
    //     return Inertia::render('AdminPages/InscriptionPage');
    // });

    // -----------------------------------------
    // Inscription Details Route for Main Pages
    // -----------------------------------------

    Route::get('/inscription-details', function () {
        return Inertia::render('MainPages/InscriptionPage');
    });

    // -----------------------------------------
    // Test Analytics Route
    // -----------------------------------------

    Route::get('/test', function () {
        $data = Analytics::fetchMostVisitedPages(Period::days(30));

        return response()->json($data);
    });

    // -----------------------------------------
    // Dashboard Route with Analytics Data
    // -----------------------------------------

    Route::get('/dashboard', [DashboardController::class, 'index'])->name('ourdashboard.index');

    // ----------------------------------------------------------
    // Activity Log Route for indexing logs in the admin panel
    // ----------------------------------------------------------

    Route::get('/ourlogs.index', [ActivityLogController::class, 'index'])->name('ourlogs.index');

    // -----------------------------------------
    // User Management CRUD Routes
    // -----------------------------------------

    Route::get('/ouruser', [UserController::class, 'index'])->name('ouruser.index');
    Route::post('/ouruser', [UserController::class, 'store'])->name('ouruser.store');
    Route::put('/ouruser/{id}', [UserController::class, 'update'])->name('ouruser.update');
    Route::delete('/ouruser/{id}', [UserController::class, 'destroy'])->name('ouruser.destroy');


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

});

    // --------------------------------------------------------------
    // Inscription Details Route for Main Pages with Dynamic Slug
    // --------------------------------------------------------------

    Route::get('/inscription-details/{slug}', [InscriptionController::class, 'showDetails'])->name('inscription.showDetails');

    // -----------------------------------------
    // Our Inscription CRUD Routes
    // -----------------------------------------

    Route::post('/ourinscription', [InscriptionController::class, 'store'])->name('ourinscription.store');
    Route::put('/ourinscription/{id}', [InscriptionController::class, 'update'])->name('ourinscription.update');
    Route::delete('/ourinscription/{id}', [InscriptionController::class, 'destroy'])->name('ourinscription.destroy');
    Route::delete('/ourinscription/image/{id}', [InscriptionController::class, 'destroyImage'])->name('ourinscription.destroyImage');
    Route::patch('/inscriptions/{id}/status', [InscriptionController::class, 'updateStatus'])->name('ourinscription.updateStatus');

    // ---------------------------------------------
    // Our Inscription Index Route for Main Pages
    // ---------------------------------------------

    Route::get('/ourinscription', [InscriptionController::class, 'index'])->name('ourinscription.index');

    Route::get('/ourcategories', [CategoryController::class, 'index'])->name('ourcategories.index');
    Route::post('/ourcategories', [CategoryController::class, 'store'])->name('ourcategories.store');
    Route::put('/ourcategories/{id}', [CategoryController::class, 'update'])->name('ourcategories.update');
    Route::delete('/ourcategories/{id}', [CategoryController::class, 'destroy'])->name('ourcategories.destroy');
    Route::get('categorywithsubcategory',[CategoryController::class,'indexWithSubCategory'])->name('categorywithsubcategory.indexWithSubCategory');

     Route::get('/categories', function () {
        return Inertia::render('AdminPages/Category');
    });


    Route::get('/oursubcategories', [SubCategoryController::class, 'index'])->name('oursubcategories.index');
    Route::post('/oursubcategories', [SubCategoryController::class, 'store'])->name('oursubcategories.store');
    Route::put('/oursubcategories/{id}', [SubCategoryController::class, 'update'])->name('oursubcategories.update');
    Route::delete('/oursubcategories/{id}', [SubCategoryController::class, 'destroy'])->name('oursubcategories.destroy');


    Route::get('/sub-categories', function () {
        return Inertia::render('AdminPages/SubCategory');
    });


    Route::get('/palaeographical-database', function () {
        return Inertia::render('AdminPages/PalaeographicalDatabase');
    });

    Route::get('/ourpalaeographical', [PalaeographicalController ::class, 'index'])->name('ourpalaeographical.index');
    Route::post('/ourpalaeographical', [PalaeographicalController ::class, 'store'])->name('ourpalaeographical.store');
    Route::put('/ourpalaeographical/{id}', [PalaeographicalController ::class, 'update'])->name('ourpalaeographical.update');
    Route::delete('/ourpalaeographical/{id}', [PalaeographicalController ::class, 'destroy'])->name('ourpalaeographical.destroy');

require __DIR__.'/auth.php';
