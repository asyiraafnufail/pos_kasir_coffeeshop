<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Menu;
use App\Models\Category;
use App\Models\Order;
use App\Models\OrderDetail;
use Illuminate\Support\Facades\DB;

class KasirController extends Controller
{
    public function index()
    {
        $menus = Menu::all();
        $categories = Category::all();

        return Inertia::render('Kasir/Index', [
            'menus' => $menus,
            'categories' => $categories
        ]);
    }

    public function store(Request $request)
    {
        // 1. Validasi data yang dikirim dari React
        $request->validate([
            'cart' => 'required|array',
            'total_price' => 'required|numeric',
            'payment_method' => 'required|in:cash,qris,debit',
        ]);

        // 2. Gunakan Database Transaction agar aman (Sesuai PRD)[cite: 1]
        DB::beginTransaction();

        try {
            // Membuat ID Struk Unik (INV-YYYYMMDDXXX)[cite: 1]
            $today = now()->format('Ymd');
            $countToday = Order::whereDate('created_at', today())->count() + 1;
            $invoiceId = 'INV-' . $today . str_pad($countToday, 3, '0', STR_PAD_LEFT);

            // Simpan Header Transaksi ke tabel orders[cite: 1]
            $order = Order::create([
                'id' => $invoiceId,
                'user_id' => auth()->id(), // Kasir yang sedang login[cite: 1]
                'total_price' => $request->total_price,
                'payment_method' => $request->payment_method,
                'status' => 'completed',
            ]);

            // Simpan Detail Item ke tabel order_details[cite: 1]
            foreach ($request->cart as $item) {
                OrderDetail::create([
                    'order_id' => $order->id,
                    'menu_id' => $item['id'],
                    'quantity' => $item['quantity'],
                    'price_at_sale' => $item['price'], // Mengunci harga saat transaksi[cite: 1]
                    'notes' => $item['notes'] ?? null,
                ]);
            }

            // Jika semua berhasil, simpan permanen ke database
            DB::commit();

            // Kembalikan respons sukses ke React
            return redirect()->back()->with('success', 'Transaksi berhasil disimpan!');

        } catch (\Exception $e) {
            // Jika ada error/gagal, batalkan semua perubahan database
            DB::rollBack();
            return redirect()->back()->withErrors(['error' => 'Gagal menyimpan transaksi: ' . $e->getMessage()]);
        }
    }
}