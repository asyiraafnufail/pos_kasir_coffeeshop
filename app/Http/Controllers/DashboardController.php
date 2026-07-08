<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Models\Order;
use App\Models\Expense;

class DashboardController extends Controller
{
    public function index()
    {
        $totalIncome = Order::sum('total_price');
        $totalExpense = Expense::sum('amount');
        $netProfit = $totalIncome - $totalExpense;
        $totalTransactions = Order::count();

        // 2. QUERY BARU: Mengambil tren penjualan harian (7 hari terakhir)
        $salesData = Order::select(DB::raw('DATE(created_at) as date'), DB::raw('SUM(total_price) as total'))
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->limit(7)
            ->get();

        // Pisahkan data menjadi label (tanggal) dan values (total uang) untuk Chart.js
        $chartLabels = $salesData->pluck('date');
        $chartValues = $salesData->pluck('total');

        return Inertia::render('Dashboard', [
            'totalIncome' => $totalIncome,
            'totalExpense' => $totalExpense,
            'netProfit' => $netProfit,
            'totalTransactions' => $totalTransactions,
            'chartLabels' => $chartLabels, // Kirim ke React
            'chartValues' => $chartValues  // Kirim ke React
        ]);
    }
}