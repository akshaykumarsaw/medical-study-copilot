import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class TutorService {
  constructor(private supabaseService: SupabaseService) {}

  async askQuestion(userId: string, question: string, subject?: string, topic?: string) {
    const supabase = this.supabaseService.getClient();

    // In a real application, we would call an LLM (e.g., OpenAI or Google GenAI) here.
    // For this MVP, we will simulate an AI response.
    const mockAnswer = `This is a simulated AI response to your question: "${question}". \n\nIn a clinical context, checking the patient's history and relevant lab values is paramount. Could you provide more details about the presenting symptoms?`;

    // Save to chat_history table
    const { data, error } = await supabase
      .from('chat_history')
      .insert({
        user_id: userId,
        question: question,
        answer: mockAnswer,
        subject: subject || null,
        topic: topic || null,
        answer_style: 'detailed',
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving chat history:', error);
      throw new Error('Failed to save chat response');
    }

    return data;
  }

  async getHistory(userId: string) {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('chat_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching chat history:', error);
      throw new Error('Failed to fetch chat history');
    }

    return data;
  }
}
