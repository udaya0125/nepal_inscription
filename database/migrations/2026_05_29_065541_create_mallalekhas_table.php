<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    // public function up(): void
    // {
    //     Schema::create('mallalekhas', function (Blueprint $table) {
    //         $table->id();
    //         $table->string('title');
    //         $table->longText('short_description')->nullable();
    //         $table->string('wchn_id')->nullable();
    //         $table->string('status')->nullable();
    //         $table->longText('description')->nullable();
    //         $table->longText('roman_text')->nullable();
    //         $table->longText('devanagari_text')->nullable();
    //         $table->longText('translation')->nullable();
    //         $table->longText('note')->nullable();
    //         $table->longText('reference')->nullable();
    //         $table->string('banner_image')->nullable();
    //         $table->string('slug')->unique()->nullable();
    //         $table->timestamps();
    //     });
    // }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mallalekhas');
    }
};
