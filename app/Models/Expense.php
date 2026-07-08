<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Expense extends Model
{
    use HasFactory;

    // Izinkan pengisian data massal untuk kolom-kolom ini
    protected $fillable = [
        'date',
        'description',
        'amount',
    ];
}