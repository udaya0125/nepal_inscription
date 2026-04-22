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
        Schema::table('inscriptions', function (Blueprint $table) {
            //
            $table->string('dev_description')->nullable()->after('description');
            $table->string('dev_background')->nullable()->after('background');
            $table->string('dev_text')->nullable()->after('text');
            $table->string('dev_translation')->nullable()->after('translation');
            $table->string('dev_references')->nullable()->after('references');
            $table->string('dev_glossary')->nullable()->after('glossary');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('inscriptions', function (Blueprint $table) {
            //
        });
    }
};
