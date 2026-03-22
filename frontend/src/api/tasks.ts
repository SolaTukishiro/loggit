import client from './client';
import type { Task } from '../types/task';

export const fetchTasks = async (params?: Record<string, string>): Promise<Task[]> => {
  const res = await client.get('/tasks', { params });
  return res.data.data;
};

export const fetchTask = async (id: number): Promise<Task> => {
  const res = await client.get(`/tasks/${id}`);
  return res.data.data;
};

export const createTask = async (projectId: number, data: Partial<Task>): Promise<Task> => {
  const res = await client.post(`/projects/${projectId}/tasks`, data);
  return res.data.data;
};

export const updateTask = async (id: number, data: Partial<Task>): Promise<Task> => {
  const res = await client.put(`/tasks/${id}`, data);
  return res.data.data;
};

export const deleteTask = async (id: number): Promise<void> => {
  await client.delete(`/tasks/${id}`);
};

export const restoreTask = async (id: number): Promise<Task> => {
  const res = await client.post(`/tasks/${id}/restore`);
  return res.data.data;
};