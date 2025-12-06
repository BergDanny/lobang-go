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
        Schema::create('quests', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('title');
            $table->text('description');
            $table->string('category');
            $table->string('location_from')->nullable();
            $table->string('location_to');
            $table->decimal('bounty', 10, 2);
            $table->datetime('deadline');
            $table->string('status')->default('open');
            $table->foreignUuid('poster_id')->constrained('users');
            $table->foreignUuid('runner_id')->nullable()->constrained('users');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quests');
    }
};
