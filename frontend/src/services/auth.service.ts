import api from './api';

export const authService = {
  async login(credentials: any) {
    const response = await api.post('/auth/login', credentials);
    if (response.data.access_token) {
      localStorage.setItem('arivu_token', response.data.access_token);
      localStorage.setItem('arivu_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async register(data: any) {
    const response = await api.post('/auth/register', data);
    if (response.data.access_token) {
      localStorage.setItem('arivu_token', response.data.access_token);
      localStorage.setItem('arivu_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async getMe() {
    const response = await api.get('/auth/me');
    return response.data;
  },

  logout() {
    localStorage.removeItem('arivu_token');
    localStorage.removeItem('arivu_user');
  },

  getCurrentUser() {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('arivu_user');
      return user ? JSON.parse(user) : null;
    }
    return null;
  }
};
