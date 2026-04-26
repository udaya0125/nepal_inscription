<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('palaeographicals', function (Blueprint $table) {
            $table->id();
            $table->string('category');
            $table->string('sub_category');
            $table->string('image');
            $table->string('image_name');
            $table->string('url')->nullable();
            $table->string('period')->nullable();
            $table->string('script')->nullable();
            $table->string('varna')->nullable();
            $table->string('symbols')->nullable();
            $table->string('citra')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('palaeographicals');
    }
};
