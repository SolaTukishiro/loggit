import type { TaskTimeLog } from './timeLog';

export type ActivityLog = {
  id: number;
  project_id: number | null;
  project_name: string | null;
  started_at: string;
  ended_at: string | null;
  duration_minutes: number | null;
  note: string | null;
  auto_stopped: boolean;
  acknowledged_at: string | null;
  is_tracking: boolean;
  task_time_logs: TaskTimeLog[];
};