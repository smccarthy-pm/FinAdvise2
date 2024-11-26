import { api } from './client';
import { Task } from '../../types/task';
import toast from 'react-hot-toast';

export const createTask = async (task: Omit<Task, 'id' | 'completed'>): Promise<Task> => {
  try {
    const response = await api.post('/api/tasks', task);
    toast.success('Task created successfully');
    return response.data;
  } catch (error) {
    toast.error('Failed to create task');
    throw error;
  }
};

export const updateTask = async (taskId: string, updates: Partial<Task>): Promise<Task> => {
  try {
    const response = await api.patch(`/api/tasks/${taskId}`, updates);
    toast.success('Task updated successfully');
    return response.data;
  } catch (error) {
    toast.error('Failed to update task');
    throw error;
  }
};

export const deleteTask = async (taskId: string): Promise<void> => {
  try {
    await api.delete(`/api/tasks/${taskId}`);
    toast.success('Task deleted successfully');
  } catch (error) {
    toast.error('Failed to delete task');
    throw error;
  }
};