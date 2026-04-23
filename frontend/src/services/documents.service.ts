import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface DocumentRecord {
  id: string;
  title: string;
  subject: string;
  type: 'textbook' | 'notes' | 'question_paper';
  file_size_bytes: number;
  status: 'uploaded' | 'processing' | 'ready' | 'failed';
  created_at: string;
}

const getAuthHeader = () => {
  const token = localStorage.getItem('arivu_token');
  return { Authorization: `Bearer ${token}` };
};

export const documentService = {
  async upload(file: File, title: string, subject: string, type: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('subject', subject);
    formData.append('type', type);

    const response = await axios.post(`${API_URL}/documents/upload`, formData, {
      headers: {
        ...getAuthHeader(),
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async getAll(): Promise<DocumentRecord[]> {
    const response = await axios.get(`${API_URL}/documents`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  async delete(id: string) {
    const response = await axios.delete(`${API_URL}/documents/${id}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },
};
