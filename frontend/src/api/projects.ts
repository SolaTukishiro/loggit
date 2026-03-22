import client from './client';
import type { Project } from '../types/project';

export const fetchProjects = async (): Promise<Project[]> => {
  const res = await client.get('/projects');
  return res.data.data;
};

export const createProject = async (data: Partial<Project>): Promise<Project> => {
  const res = await client.post('/projects', data);
  return res.data.data;
};

export const updateProject = async (id: number, data: Partial<Project>): Promise<Project> => {
  const res = await client.put(`/projects/${id}`, data);
  return res.data.data;
};

export const deleteProject = async (id: number): Promise<void> => {
  await client.delete(`/projects/${id}`);
};

export const fetchProject = async (id: number): Promise<Project> => {
  const res = await client.get(`/projects/${id}`);
  return res.data.data;
};