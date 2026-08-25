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
            $table->string('child_category_id')->nullable()->after('sub_category_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('palaeographicals', function (Blueprint $table) {
            //
            $table->dropColumn('child_category_id');
        });
    }
};
