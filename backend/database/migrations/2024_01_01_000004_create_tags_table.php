<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tags', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('color')->default('#3498db');
            $table->timestamps();
        });

        Schema::create('card_tag', function (Blueprint $table) {
            $table->id();
            $table->foreignId('card_id')->constrained()->cascadeOnDelete();
            $table->foreignId('tag_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
            $table->unique(['card_id', 'tag_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('card_tag');
        Schema::dropIfExists('tags');
    }
};
