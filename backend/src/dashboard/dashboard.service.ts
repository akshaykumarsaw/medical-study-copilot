import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class DashboardService {
  constructor(private supabaseService: SupabaseService) {}

  async getSummary(userId: string) {
    const supabase = this.supabaseService.getClient();

    // Fetch total questions answered
    const { count: totalQuestions, error: err1 } = await supabase
      .from('quiz_answers')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    // Fetch recent quiz scores to calculate average
    const { data: recentQuizzes, error: err2 } = await supabase
      .from('quizzes')
      .select('score, total')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false })
      .limit(10);

    let avgScore = 0;
    if (recentQuizzes && recentQuizzes.length > 0) {
      const validQuizzes = recentQuizzes.filter(q => q.total > 0);
      if (validQuizzes.length > 0) {
        const totalPercentage = validQuizzes.reduce((acc, curr) => acc + (curr.score / curr.total * 100), 0);
        avgScore = Math.round(totalPercentage / validQuizzes.length);
      }
    }

    // Overall mastery
    const { data: masteryData, error: err3 } = await supabase
      .from('topic_mastery')
      .select('mastery_score')
      .eq('user_id', userId);

    let overallMastery = 0;
    if (masteryData && masteryData.length > 0) {
      const totalMastery = masteryData.reduce((acc, curr) => acc + curr.mastery_score, 0);
      overallMastery = Math.round(totalMastery / masteryData.length);
    }

    // Case sessions completed
    const { count: casesCompleted, error: err4 } = await supabase
      .from('case_sessions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('completed', true);

    return {
      totalQuestions: totalQuestions || 0,
      averageScore: avgScore,
      overallMastery,
      casesCompleted: casesCompleted || 0,
    };
  }

  async getWeakTopics(userId: string) {
    const supabase = this.supabaseService.getClient();
    const { data: weakTopics } = await supabase
      .from('topic_mastery')
      .select('*')
      .eq('user_id', userId)
      .lt('mastery_score', 60)
      .order('mastery_score', { ascending: true })
      .limit(5);
    
    return weakTopics || [];
  }

  async getActivity(userId: string) {
    // Generate dummy weekly activity data for MVP testing
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map(day => ({
      name: day,
      questions: Math.floor(Math.random() * 50),
      duration: Math.floor(Math.random() * 120), // minutes
    }));
  }
}
