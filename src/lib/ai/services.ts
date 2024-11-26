import { Task } from '../../types/task';
import { Event } from '../../types/event';
import { api } from '../api/client';

interface CRMRecord {
  id: string;
  type: 'contact' | 'lead' | 'opportunity';
  name: string;
  status: string;
  lastInteraction?: string;
  nextFollowUp?: string;
}

export class AIServices {
  private async validateEnvironment(): Promise<boolean> {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (!apiKey) {
      console.error('OpenAI API key is missing');
      return false;
    }
    return true;
  }

  // Task Management
  async createTask(details: Omit<Task, 'id' | 'completed'>): Promise<Task> {
    try {
      const response = await api.post('/api/tasks', details);
      return response.data;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }

  async updateTask(taskId: string, updates: Partial<Task>): Promise<Task> {
    try {
      const response = await api.patch(`/api/tasks/${taskId}`, updates);
      return response.data;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  }

  // Calendar Management
  async scheduleEvent(details: Omit<Event, 'id'>): Promise<Event> {
    try {
      const response = await api.post('/api/events', details);
      return response.data;
    } catch (error) {
      console.error('Error scheduling event:', error);
      throw error;
    }
  }

  async updateEvent(eventId: string, updates: Partial<Event>): Promise<Event> {
    try {
      const response = await api.patch(`/api/events/${eventId}`, updates);
      return response.data;
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  }

  // CRM Management
  async getCRMRecords(type: 'contact' | 'lead' | 'opportunity'): Promise<CRMRecord[]> {
    try {
      const response = await api.get(`/api/crm/${type}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching CRM records:', error);
      throw error;
    }
  }

  async updateCRMRecord(recordId: string, updates: Partial<CRMRecord>): Promise<CRMRecord> {
    try {
      const response = await api.patch(`/api/crm/records/${recordId}`, updates);
      return response.data;
    } catch (error) {
      console.error('Error updating CRM record:', error);
      throw error;
    }
  }

  // Reminder Management
  async setReminder(details: {
    type: 'task' | 'event' | 'crm';
    referenceId: string;
    date: string;
    description: string;
  }): Promise<void> {
    try {
      await api.post('/api/reminders', details);
    } catch (error) {
      console.error('Error setting reminder:', error);
      throw error;
    }
  }

  // Report Generation
  async generateReport(type: string, filters: Record<string, unknown>): Promise<string> {
    try {
      const response = await api.post('/api/reports/generate', { type, filters });
      return response.data;
    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    }
  }

  // AI Chat
  async processMessage(text: string, context?: string): Promise<{
    content: string;
    suggestions: string[];
  }> {
    try {
      if (!await this.validateEnvironment()) {
        throw new Error('Environment not properly configured');
      }

      const response = await api.post('/api/ai/chat', {
        text,
        context
      });

      return {
        content: response.data.content,
        suggestions: response.data.suggestions || []
      };
    } catch (error) {
      console.error('Error processing message:', error);
      throw error;
    }
  }
}