import api from './api';

export interface QuizQuestion {
  question: string;
  options: string[];
  subject: string;
  topic: string;
  difficulty: string;
}

export interface GeneratedQuiz {
  quiz_id: string;
  questions: QuizQuestion[];
  total: number;
  subject: string;
  difficulty: string;
}

export interface QuizResult {
  score: number;
  total: number;
  percentage: number;
  time_taken_seconds: number;
  results: {
    question: string;
    options: string[];
    selected_index: number;
    correct_index: number;
    is_correct: boolean;
    explanation: string;
    subject: string;
    topic: string;
  }[];
}

export interface QuizHistoryItem {
  id: string;
  subject: string;
  topic: string | null;
  score: number;
  total: number;
  difficulty: string;
  completed_at: string;
  created_at: string;
  time_taken_seconds: number;
}

export const quizService = {
  async generateQuiz(subject: string, numQuestions: number, difficulty: string): Promise<GeneratedQuiz> {
    const response = await api.post('/quiz/generate', { subject, numQuestions, difficulty });
    return response.data;
  },

  async submitQuiz(quizId: string, answers: number[], timeTakenSeconds: number): Promise<QuizResult> {
    const response = await api.post(`/quiz/${quizId}/submit`, { answers, timeTakenSeconds });
    return response.data;
  },

  async getHistory(): Promise<QuizHistoryItem[]> {
    const response = await api.get('/quiz/history');
    return response.data;
  },
};
