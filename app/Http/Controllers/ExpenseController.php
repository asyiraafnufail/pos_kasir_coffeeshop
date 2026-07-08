<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Expense;
use Inertia\Inertia;

class ExpenseController extends Controller
{
    // Menampilkan halaman dan data pengeluaran
    public function index()
    {
        // Ambil data pengeluaran, urutkan dari tanggal terbaru
        $expenses = Expense::orderBy('date', 'desc')->get();
        
        return Inertia::render('Admin/Expense/Index', [
            'expenses' => $expenses
        ]);
    }

    // Menyimpan data pengeluaran baru
    public function store(Request $request)
    {
        $request->validate([
            'date' => 'required|date',
            'description' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
        ]);

        Expense::create($request->all());

        return redirect()->back()->with('success', 'Pengeluaran berhasil dicatat!');
    }

    // Menghapus data pengeluaran
    public function destroy($id)
    {
        Expense::findOrFail($id)->delete();
        return redirect()->back()->with('success', 'Data pengeluaran dihapus!');
    }
}