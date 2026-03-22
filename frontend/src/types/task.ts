import type { ProjectStatus } from './project';

export type Priority = 1 | 2 | 3;
export type PriorityLabel = 'low' | 'mid' | 'high';

export type Task = {
  id: number;
  project_id: number;
  project_name: string;
  parent_task_id: number | null;
  status_id: number;
  status: ProjectStatus;
  title: string;
  description: string | null;
  priority: Priority;
  priority_label: PriorityLabel;
  due_date: string | null;
  subtasks: Task[];
  subtask_count: number;
  completed_subtask_count: number;
  total_tracked_minutes: number;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
};