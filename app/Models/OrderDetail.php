<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderDetail extends Model
{
    use HasFactory;

    // Matikan pencatatan waktu otomatis karena tabel ini tidak memiliki kolom created_at/updated_at
    public $timestamps = false; 

    // Daftarkan kolom yang diizinkan
    protected $fillable = [
        'order_id',
        'menu_id',
        'quantity',
        'price_at_sale',
        'notes',
    ];
}