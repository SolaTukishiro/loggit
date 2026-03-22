import client from './client';
import type { ActivityLog } from '../types/activityLog';

export const fetchActivityLogs = async (params?: Record<string, string>) => {
  const res = await client.get('/activity-logs', { params });
  return res.data;
};

export const fetchSummary = async (period: 'week' | 'month') => {
  const res = await client.get('/activity-logs/summary', { params: { period } });
  return res.data.data;
};

export const startTracking = async (data: {
  project_id?: number;
  note?: string;
}): Promise<ActivityLog> => {
  const res = await client.post('/activity-logs/start', data);
  return res.data.data;
};

export const stopTracking = async (id: number): Promise<ActivityLog> => {
  const res = await client.post(`/activity-logs/${id}/stop`);
  return res.data.data;
};

export const acknowledgeLog = async (id: number): Promise<ActivityLog> => {
  const res = await client.post(`/activity-logs/${id}/acknowledge`);
  return res.data.data;
};

export const deleteActivityLog = async (id: number): Promise<void> => {
  await client.delete(`/activity-logs/${id}`);
};