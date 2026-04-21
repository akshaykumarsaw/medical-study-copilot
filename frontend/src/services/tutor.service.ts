import api from './api';

export interface ChatMessage {
  id?: string;
  user_id?: string;
  question: string;
  answer: string;
  subject?: string;
  topic?: string;
  created_at?: string;
}

export const tutorService = {
  async askQuestion(question: string, subject?: string, topic?: string): Promise<ChatMessage> {
    const response = await api.post('/tutor/ask', { question, subject, topic });
    return response.data;
  },

  async getHistory(): Promise<ChatMessage[]> {
    const response = await api.get('/tutor/history');
    return response.data;
  }
};
