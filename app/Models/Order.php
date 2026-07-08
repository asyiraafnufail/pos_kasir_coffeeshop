<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    // 1. Beritahu Laravel bahwa ID kita adalah String (Teks), bukan angka Auto-Increment
    public $incrementing = false;
    protected $keyType = 'string';

    // 2. Daftarkan kolom yang diizinkan untuk diisi data secara massal
    protected $fillable = [
        'id',
        'user_id',
        'total_price',
        'payment_method',
        'status',
    ];
}