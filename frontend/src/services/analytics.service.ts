import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface ErrorLogRecord {
  id: string;
  question_text: string;
  selected_option: string;
  correct_option: string;
  subject: string;
  topic: string;
  created_at: string;
}

export interface TopicMastery {
  id: string;
  subject: string;
  topic: string;
  mastery_score: number;
  questions_seen: number;
  questions_correct: number;
  last_practiced: string;
}

export interface MasteryOverview {
  topics: TopicMastery[];
  stats: {
    totalTopics: number;
    avgScore: number;
    weakTopicsCount: number;
    strongTopicsCount: number;
  };
  weakTopics: TopicMastery[];
}

const getAuthHeader = () => {
  const token = localStorage.getItem('arivu_token');
  return { Authorization: `Bearer ${token}` };
};

export const analyticsService = {
  async getErrorLog(): Promise<ErrorLogRecord[]> {
    const response = await axios.get(`${API_URL}/analytics/error-log`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  async getMastery(): Promise<MasteryOverview> {
    const response = await axios.get(`${API_URL}/analytics/mastery`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  async getActivity() {
    const response = await axios.get(`${API_URL}/analytics/activity`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },
};
