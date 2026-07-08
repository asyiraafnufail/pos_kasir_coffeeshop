<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->string('id', 50)->primary(); // ID struk unik (Primary Key)
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade'); // Kasir
            $table->decimal('total_price', 10, 2); // Total belanja
            $table->enum('payment_method', ['cash', 'qris', 'debit']); // Metode pembayaran
            $table->enum('status', ['completed', 'cancelled'])->default('completed'); // Status
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
