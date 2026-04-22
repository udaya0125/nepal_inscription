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
            $table->longText('dev_description')->nullable()->after('description');
            $table->longText('dev_background')->nullable()->after('background');
            $table->longText('dev_text')->nullable()->after('text');
            $table->longText('dev_translation')->nullable()->after('translation');
            $table->longText('dev_references')->nullable()->after('references');
            $table->longText('dev_glossary')->nullable()->after('glossary');
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
