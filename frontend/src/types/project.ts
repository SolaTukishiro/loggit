export type ProjectStatus = {
  id: number;
  name: string;
  order: number;
};

export type Project = {
  id: number;
  name: string;
  description: string | null;
  color: string | null;
  due_date: string | null;
  task_count: number;
  completed_task_count: number;
  statuses: ProjectStatus[];
  created_at: string;
  updated_at: string;
};