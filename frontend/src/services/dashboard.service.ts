import api from './api';

export const dashboardService = {
  async getSummary() {
    const response = await api.get('/dashboard/summary');
    return response.data;
  },

  async getWeakTopics() {
    const response = await api.get('/dashboard/weak-topics');
    return response.data;
  },

  async getActivity() {
    const response = await api.get('/dashboard/activity');
    return response.data;
  }
};
