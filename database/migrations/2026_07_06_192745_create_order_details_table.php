<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('order_details', function (Blueprint $table) {
            $table->id();
            
            // Relasi ke tabel orders dengan tipe data string
            $table->string('order_id', 50);
            $table->foreign('order_id')->references('id')->on('orders')->onDelete('cascade');
            
            $table->foreignId('menu_id')->constrained('menus')->onDelete('cascade'); // Item menu
            $table->integer('quantity'); // Jumlah beli
            $table->decimal('price_at_sale', 10, 2); // Mengunci harga saat transaksi
            $table->string('notes', 255)->nullable(); // Catatan khusus (opsional)
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_details');
    }
};
