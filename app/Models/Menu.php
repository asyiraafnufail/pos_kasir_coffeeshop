<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Menu extends Model
{
    use HasFactory;

    // Daftarkan kolom yang diizinkan untuk diisi dari form (Mass Assignment)
    protected $fillable = [
        'name',
        'category_id',
        'price',
        'is_available',
    ];
}