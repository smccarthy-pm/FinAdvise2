import { api } from './client';

export const generateResponse = async (
  text: string,
  history: Array<{ type: string; content: string }> = []
): Promise<{ content: string; suggestions: string[] }> => {
  try {
    const response = await api.post('/api/ai/chat', { text, history });
    return response.data;
  } catch (error) {
    console.error('AI response error:', error);
    throw error;
  }
};