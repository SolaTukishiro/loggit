<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('task_time_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('task_id')->constrained()->cascadeOnDelete();
            $table->foreignId('activity_log_id')->nullable()
                  ->constrained('activity_logs')->nullOnDelete();
            $table->unsignedInteger('duration_minutes');
            $table->date('worked_on')->nullable();
            $table->text('note')->nullable();
            $table->timestamps();
            $table->index('task_id');
            $table->index('activity_log_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('task_time_logs');
    }
};
