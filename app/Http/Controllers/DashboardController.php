<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Order;
use App\Models\Expense;

class DashboardController extends Controller
{
    public function index()
    {
        // 1. Hitung total pendapatan kotor dari semua transaksi kasir
        $totalIncome = Order::sum('total_price');

        // 2. Hitung total pengeluaran dari pencatatan admin
        $totalExpense = Expense::sum('amount');

        // 3. Hitung keuntungan bersih (Net Profit)
        $netProfit = $totalIncome - $totalExpense;

        // 4. Hitung jumlah transaksi yang pernah terjadi
        $totalTransactions = Order::count();

        // Kirim data ke React
        return Inertia::render('Dashboard', [
            'totalIncome' => $totalIncome,
            'totalExpense' => $totalExpense,
            'netProfit' => $netProfit,
            'totalTransactions' => $totalTransactions
        ]);
    }
}