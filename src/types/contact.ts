export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  type: 'client' | 'prospect' | 'partner';
  status: 'active' | 'inactive' | 'lead';
  notes?: string;
  lastContact?: string;
  nextFollowUp?: string;
}