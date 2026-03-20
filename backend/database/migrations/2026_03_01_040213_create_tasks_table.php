<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained()->cascadeOnDelete();
            $table->foreignId('parent_task_id')->nullable()
                  ->constrained('tasks')->cascadeOnDelete();
            $table->foreignId('status_id')
                  ->constrained('project_statuses')->restrictOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->tinyInteger('priority')->default(1);
            $table->date('due_date')->nullable();
            $table->softDeletes();
            $table->timestamps();
            $table->index('project_id');
            $table->index('status_id');
            $table->index('due_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
