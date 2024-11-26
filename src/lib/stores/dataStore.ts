import { create } from 'zustand';
import { Task } from '../../types/task';
import { Event } from '../../types/event';
import { Contact } from '../../types/contact';
import * as api from '../api';

interface DataStore {
  tasks: Task[];
  events: Event[];
  contacts: Contact[];
  loading: boolean;
  error: string | null;
  
  // Tasks
  addTask: (task: Omit<Task, 'id' | 'completed'>) => Promise<void>;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  
  // Events
  addEvent: (event: Omit<Event, 'id'>) => Promise<void>;
  updateEvent: (eventId: string, updates: Partial<Event>) => Promise<void>;
  deleteEvent: (eventId: string) => Promise<void>;
  
  // Contacts
  addContact: (contact: Omit<Contact, 'id'>) => Promise<void>;
  updateContact: (contactId: string, updates: Partial<Contact>) => Promise<void>;
  deleteContact: (contactId: string) => Promise<void>;
}

export const useDataStore = create<DataStore>((set, get) => ({
  tasks: [],
  events: [],
  contacts: [],
  loading: false,
  error: null,

  // Tasks
  addTask: async (taskData) => {
    set({ loading: true });
    try {
      const newTask = await api.createTask(taskData);
      set(state => ({
        tasks: [...state.tasks, newTask],
        loading: false
      }));
    } catch (error) {
      set({ loading: false, error: 'Failed to create task' });
    }
  },

  updateTask: async (taskId, updates) => {
    set({ loading: true });
    try {
      const updatedTask = await api.updateTask(taskId, updates);
      set(state => ({
        tasks: state.tasks.map(task => 
          task.id === taskId ? updatedTask : task
        ),
        loading: false
      }));
    } catch (error) {
      set({ loading: false, error: 'Failed to update task' });
    }
  },

  deleteTask: async (taskId) => {
    set({ loading: true });
    try {
      await api.deleteTask(taskId);
      set(state => ({
        tasks: state.tasks.filter(task => task.id !== taskId),
        loading: false
      }));
    } catch (error) {
      set({ loading: false, error: 'Failed to delete task' });
    }
  },

  // Events
  addEvent: async (eventData) => {
    set({ loading: true });
    try {
      const newEvent = await api.createEvent(eventData);
      set(state => ({
        events: [...state.events, newEvent],
        loading: false
      }));
    } catch (error) {
      set({ loading: false, error: 'Failed to create event' });
    }
  },

  updateEvent: async (eventId, updates) => {
    set({ loading: true });
    try {
      const updatedEvent = await api.updateEvent(eventId, updates);
      set(state => ({
        events: state.events.map(event => 
          event.id === eventId ? updatedEvent : event
        ),
        loading: false
      }));
    } catch (error) {
      set({ loading: false, error: 'Failed to update event' });
    }
  },

  deleteEvent: async (eventId) => {
    set({ loading: true });
    try {
      await api.deleteEvent(eventId);
      set(state => ({
        events: state.events.filter(event => event.id !== eventId),
        loading: false
      }));
    } catch (error) {
      set({ loading: false, error: 'Failed to delete event' });
    }
  },

  // Contacts
  addContact: async (contactData) => {
    set({ loading: true });
    try {
      const newContact = await api.createContact(contactData);
      set(state => ({
        contacts: [...state.contacts, newContact],
        loading: false
      }));
    } catch (error) {
      set({ loading: false, error: 'Failed to create contact' });
    }
  },

  updateContact: async (contactId, updates) => {
    set({ loading: true });
    try {
      const updatedContact = await api.updateContact(contactId, updates);
      set(state => ({
        contacts: state.contacts.map(contact => 
          contact.id === contactId ? updatedContact : contact
        ),
        loading: false
      }));
    } catch (error) {
      set({ loading: false, error: 'Failed to update contact' });
    }
  },

  deleteContact: async (contactId) => {
    set({ loading: true });
    try {
      await api.deleteContact(contactId);
      set(state => ({
        contacts: state.contacts.filter(contact => contact.id !== contactId),
        loading: false
      }));
    } catch (error) {
      set({ loading: false, error: 'Failed to delete contact' });
    }
  }
}));