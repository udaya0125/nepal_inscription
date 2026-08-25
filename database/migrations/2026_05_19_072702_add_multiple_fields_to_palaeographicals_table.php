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
        Schema::table('palaeographicals', function (Blueprint $table) {
            //
            $table->integer('order')->nullable()->after('child_category_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('palaeographicals', function (Blueprint $table) {
            //
            $table->dropColumn('order');
        });
    }
};
