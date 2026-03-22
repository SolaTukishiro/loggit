import client from './client';
import type { TaskTimeLog } from '../types/timeLog';

export const fetchTimeLogs = async (taskId: number): Promise<TaskTimeLog[]> => {
  const res = await client.get(`/tasks/${taskId}/time-logs`);
  return res.data.data;
};

export const createTimeLog = async (
  taskId: number,
  data: {
    duration_minutes: number;
    activity_log_id?: number;
    worked_on?: string;
    note?: string;
  }
): Promise<TaskTimeLog> => {
  const res = await client.post(`/tasks/${taskId}/time-logs`, data);
  return res.data.data;
};

export const deleteTimeLog = async (taskId: number, timeLogId: number): Promise<void> => {
  await client.delete(`/tasks/${taskId}/time-logs/${timeLogId}`);
};