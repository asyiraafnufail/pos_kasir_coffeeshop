<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\KasirController;
use App\Http\Controllers\MenuController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('login'); // Langsung arahkan halaman depan ke login
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    // --- Rute Kasir ---
    Route::get('/kasir', [KasirController::class, 'index'])->name('kasir.index');
    Route::post('/orders', [KasirController::class, 'store'])->name('orders.store'); 
    
    // --- Rute Admin: Manajemen Menu ---
    Route::get('/menu', [MenuController::class, 'index'])->name('menu.index');
    Route::get('/menu', [MenuController::class, 'index'])->name('menu.index'); 
    Route::post('/menu', [MenuController::class, 'store'])->name('menu.store');

    // --- Rute Profile ---
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
