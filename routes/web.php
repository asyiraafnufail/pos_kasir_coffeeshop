<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\KasirController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\DashboardController;  
use App\Http\Controllers\EmployeeController; 
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('login'); 
});

Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    // --- Rute Kasir ---
    Route::get('/kasir', [KasirController::class, 'index'])->name('kasir.index');
    Route::post('/orders', [KasirController::class, 'store'])->name('orders.store'); 
    
    // --- Rute Admin: Manajemen Menu ---
    Route::get('/menu', [MenuController::class, 'index'])->name('menu.index'); 
    Route::post('/menu', [MenuController::class, 'store'])->name('menu.store'); 
    Route::put('/menu/{id}', [MenuController::class, 'update'])->name('menu.update');
    Route::delete('/menu/{id}', [MenuController::class, 'destroy'])->name('menu.destroy');

    // --- Rute Admin: Manajemen Pengeluaran ---
    Route::get('/pengeluaran', [ExpenseController::class, 'index'])->name('expense.index');
    Route::post('/pengeluaran', [ExpenseController::class, 'store'])->name('expense.store');
    Route::delete('/pengeluaran/{id}', [ExpenseController::class, 'destroy'])->name('expense.destroy');

    // --- Rute Admin: Manajemen Karyawan ---
    Route::get('/karyawan', [EmployeeController::class, 'index'])->name('employee.index');
    Route::post('/karyawan', [EmployeeController::class, 'store'])->name('employee.store');
    Route::put('/karyawan/{id}', [EmployeeController::class, 'update'])->name('employee.update');
    Route::delete('/karyawan/{id}', [EmployeeController::class, 'destroy'])->name('employee.destroy');

    // --- Rute Profile ---
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
