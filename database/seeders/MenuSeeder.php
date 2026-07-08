<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Menu;

class MenuSeeder extends Seeder
{
    public function run(): void
    {
        // Membuat Kategori
        $kopi = Category::create(['name' => 'Coffee']);
        $nonKopi = Category::create(['name' => 'Non-Coffee']);
        $makanan = Category::create(['name' => 'Food']);

        // Membuat Menu Kopi
        Menu::create(['category_id' => $kopi->id, 'name' => 'Espresso', 'price' => 15000, 'is_available' => 1]);
        Menu::create(['category_id' => $kopi->id, 'name' => 'Caffe Latte', 'price' => 22000, 'is_available' => 1]);
        Menu::create(['category_id' => $kopi->id, 'name' => 'Caramel Macchiato', 'price' => 25000, 'is_available' => 0]); // Contoh stok habis

        // Membuat Menu Non-Kopi
        Menu::create(['category_id' => $nonKopi->id, 'name' => 'Matcha Latte', 'price' => 24000, 'is_available' => 1]);
        Menu::create(['category_id' => $nonKopi->id, 'name' => 'Red Velvet', 'price' => 24000, 'is_available' => 1]);

        // Membuat Menu Makanan
        Menu::create(['category_id' => $makanan->id, 'name' => 'French Fries', 'price' => 18000, 'is_available' => 1]);
    }
}