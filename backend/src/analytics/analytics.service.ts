import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class AnalyticsService {
  constructor(private supabaseService: SupabaseService) {}

  async getErrorLog(userId: string) {
    const supabase = this.supabaseService.getClient();
    
    // Get all wrong answers
    const { data, error } = await supabase
      .from('quiz_answers')
      .select('id, question_text, selected_option, correct_option, subject, topic, created_at')
      .eq('user_id', userId)
      .eq('is_correct', false)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  }

  async getMasteryOverview(userId: string) {
    const supabase = this.supabaseService.getClient();
    
    // Get topic mastery scores
    const { data: mastery, error } = await supabase
      .from('topic_mastery')
      .select('*')
      .eq('user_id', userId)
      .order('mastery_score', { ascending: true });

    if (error) throw new Error(error.message);

    // Calculate overall statistics
    const totalTopics = mastery?.length || 0;
    const avgScore = totalTopics > 0 
      ? Math.round(mastery.reduce((acc, curr) => acc + curr.mastery_score, 0) / totalTopics)
      : 0;

    const weakTopics = mastery?.filter(m => m.mastery_score < 60) || [];
    const strongTopics = mastery?.filter(m => m.mastery_score >= 80) || [];

    return {
      topics: mastery || [],
      stats: {
        totalTopics,
        avgScore,
        weakTopicsCount: weakTopics.length,
        strongTopicsCount: strongTopics.length,
      },
      weakTopics: weakTopics.slice(0, 5), // Top 5 priority areas
    };
  }

  async getActivityStats(userId: string) {
    const supabase = this.supabaseService.getClient();
    
    // Get total questions answered
    const { count: totalQuestions } = await supabase
      .from('quiz_answers')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    // Get quizzes taken in last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data: recentQuizzes } = await supabase
      .from('quizzes')
      .select('score, total, created_at')
      .eq('user_id', userId)
      .gte('created_at', sevenDaysAgo.toISOString())
      .not('completed_at', 'is', null);

    return {
      totalQuestions: totalQuestions || 0,
      recentQuizzesCount: recentQuizzes?.length || 0,
      avgRecentScore: recentQuizzes?.length 
        ? Math.round(recentQuizzes.reduce((acc, q) => acc + (q.score / q.total), 0) / recentQuizzes.length * 100)
        : 0,
    };
  }
}
