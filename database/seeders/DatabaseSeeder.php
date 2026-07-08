<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Membuat akun Admin
        User::create([
            'username' => 'admin',
            'role' => 'admin',
            'password' => Hash::make('12345678'), 
        ]);

        // Membuat akun Kasir
        User::create([
            'username' => 'kasir1',
            'role' => 'kasir',
            'password' => Hash::make('12345678'),
        ]);
    }
}