<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('activity_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('project_id')->nullable()
                  ->constrained()->nullOnDelete();
            $table->datetime('started_at');
            $table->datetime('ended_at')->nullable();
            $table->text('note')->nullable();
            $table->boolean('auto_stopped')->default(false);
            $table->timestamp('acknowledged_at')->nullable();
            $table->timestamps();
            $table->index('user_id');
            $table->index('project_id');
            $table->index('started_at');
            $table->index(['user_id', 'started_at']);
        });

        // CHECK制約（ended_atはstarted_atより後）
        DB::statement(
            'ALTER TABLE activity_logs
             ADD CONSTRAINT chk_ended_after_started
             CHECK (ended_at IS NULL OR ended_at > started_at)'
        );
    }

    public function down(): void
    {
        Schema::dropIfExists('activity_logs');
    }
};
