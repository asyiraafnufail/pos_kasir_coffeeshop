<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Menu;
use App\Models\Category;

class MenuController extends Controller
{
    public function index()
    {
        // Mengambil semua menu dan menggabungkannya dengan nama kategori
        $menus = Menu::join('categories', 'menus.category_id', '=', 'categories.id')
            ->select('menus.*', 'categories.name as category_name')
            ->orderBy('category_id')
            ->get();
            
        $categories = Category::all();

        return Inertia::render('Admin/Menu/Index', [
            'menus' => $menus,
            'categories' => $categories
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'price' => 'required|numeric|min:0',
            'is_available' => 'required|boolean',
        ]);

        Menu::create([
            'name' => $request->name,
            'category_id' => $request->category_id,
            'price' => $request->price,
            'is_available' => $request->is_available,
        ]);

        return redirect()->back()->with('success', 'Menu baru berhasil ditambahkan!');
    }
}