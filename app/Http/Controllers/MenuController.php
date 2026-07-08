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
}