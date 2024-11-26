import { api } from './client';
import { Contact } from '../../types/contact';
import toast from 'react-hot-toast';

export const createContact = async (contact: Omit<Contact, 'id'>): Promise<Contact> => {
  try {
    const response = await api.post('/api/contacts', contact);
    toast.success('Contact created successfully');
    return response.data;
  } catch (error) {
    toast.error('Failed to create contact');
    throw error;
  }
};

export const updateContact = async (contactId: string, updates: Partial<Contact>): Promise<Contact> => {
  try {
    const response = await api.patch(`/api/contacts/${contactId}`, updates);
    toast.success('Contact updated successfully');
    return response.data;
  } catch (error) {
    toast.error('Failed to update contact');
    throw error;
  }
};

export const deleteContact = async (contactId: string): Promise<void> => {
  try {
    await api.delete(`/api/contacts/${contactId}`);
    toast.success('Contact deleted successfully');
  } catch (error) {
    toast.error('Failed to delete contact');
    throw error;
  }
};