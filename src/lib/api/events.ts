import { api } from './client';
import { Event } from '../../types/event';
import toast from 'react-hot-toast';

export const createEvent = async (event: Omit<Event, 'id'>): Promise<Event> => {
  try {
    const response = await api.post('/api/events', event);
    toast.success('Event created successfully');
    return response.data;
  } catch (error) {
    toast.error('Failed to create event');
    throw error;
  }
};

export const updateEvent = async (eventId: string, updates: Partial<Event>): Promise<Event> => {
  try {
    const response = await api.patch(`/api/events/${eventId}`, updates);
    toast.success('Event updated successfully');
    return response.data;
  } catch (error) {
    toast.error('Failed to update event');
    throw error;
  }
};

export const deleteEvent = async (eventId: string): Promise<void> => {
  try {
    await api.delete(`/api/events/${eventId}`);
    toast.success('Event deleted successfully');
  } catch (error) {
    toast.error('Failed to delete event');
    throw error;
  }
};