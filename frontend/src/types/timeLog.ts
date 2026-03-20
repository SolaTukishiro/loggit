export type TaskTimeLog = {
  id: number;
  task_id: number;
  activity_log_id: number | null;
  duration_minutes: number;
  worked_on: string | null;
  note: string | null;
  created_at: string;
};