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
        Schema::create('inscriptions', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('banner_image')->nullable();
            $table->string('video')->nullable();
            $table->longText('description')->nullable();
            $table->longText('background')->nullable();
            $table->longText('text')->nullable();
            $table->longText('translation')->nullable();
            $table->longText('refrences')->nullable();
            $table->longText('glossary')->nullable();
            $table->string('slug')->unique();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inscriptions');
    }
};
