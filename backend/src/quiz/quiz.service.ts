import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

export interface QuizQuestion {
  question: string;
  options: string[];
  correct_index: number;
  explanation: string;
  subject: string;
  topic: string;
  difficulty: string;
}

// A bank of sample medical MCQs for MVP demonstration
const QUESTION_BANK: QuizQuestion[] = [
  {
    question: 'Which of the following is the primary pacemaker of the heart?',
    options: ['AV Node', 'Bundle of His', 'SA Node', 'Purkinje Fibers'],
    correct_index: 2,
    explanation: 'The SA (Sinoatrial) Node is the primary pacemaker of the heart, generating impulses at 60-100 bpm.',
    subject: 'Physiology',
    topic: 'Cardiac Physiology',
    difficulty: 'easy',
  },
  {
    question: 'The most common cause of community-acquired pneumonia (CAP) in adults is:',
    options: ['Staphylococcus aureus', 'Streptococcus pneumoniae', 'Klebsiella pneumoniae', 'Mycoplasma pneumoniae'],
    correct_index: 1,
    explanation: 'Streptococcus pneumoniae (pneumococcus) is the most common bacterial cause of community-acquired pneumonia in adults.',
    subject: 'Microbiology',
    topic: 'Respiratory Infections',
    difficulty: 'easy',
  },
  {
    question: 'Which nerve is damaged in wrist drop?',
    options: ['Ulnar nerve', 'Median nerve', 'Radial nerve', 'Musculocutaneous nerve'],
    correct_index: 2,
    explanation: 'Wrist drop (inability to extend the wrist) is caused by radial nerve injury, typically from mid-shaft humerus fracture.',
    subject: 'Anatomy',
    topic: 'Upper Limb Nerves',
    difficulty: 'easy',
  },
  {
    question: 'McBurney\'s point is located at:',
    options: [
      '1/3rd from the right ASIS to umbilicus',
      '2/3rd from the right ASIS to umbilicus',
      '1/3rd from the umbilicus to the right ASIS',
      '1/2 way between the right ASIS and umbilicus'
    ],
    correct_index: 0,
    explanation: 'McBurney\'s point is at 1/3rd of the distance from the right anterior superior iliac spine (ASIS) to the umbilicus.',
    subject: 'Anatomy',
    topic: 'Abdominal Landmarks',
    difficulty: 'medium',
  },
  {
    question: 'Which drug is the drug of choice for status epilepticus?',
    options: ['Phenytoin', 'Lorazepam', 'Carbamazepine', 'Valproate'],
    correct_index: 1,
    explanation: 'IV Lorazepam (a benzodiazepine) is the first-line treatment for status epilepticus due to its rapid onset.',
    subject: 'Pharmacology',
    topic: 'Antiepileptics',
    difficulty: 'medium',
  },
  {
    question: 'Virchow\'s triad for thrombus formation includes all EXCEPT:',
    options: ['Stasis of blood flow', 'Endothelial injury', 'Hypercoagulability', 'Hyperlipidemia'],
    correct_index: 3,
    explanation: 'Virchow\'s triad consists of: stasis, endothelial injury, and hypercoagulability. Hyperlipidemia is not part of the classic triad.',
    subject: 'Pathology',
    topic: 'Thrombosis',
    difficulty: 'medium',
  },
  {
    question: 'The mechanism of action of metformin is:',
    options: [
      'Stimulates insulin secretion from beta cells',
      'Inhibits hepatic gluconeogenesis via AMPK activation',
      'Insulin sensitizer acting on PPAR-gamma',
      'Inhibits alpha-glucosidase in the intestine'
    ],
    correct_index: 1,
    explanation: 'Metformin primarily acts by activating AMPK, which inhibits hepatic gluconeogenesis and reduces glucose output from the liver.',
    subject: 'Pharmacology',
    topic: 'Antidiabetics',
    difficulty: 'hard',
  },
  {
    question: 'Which type of hypersensitivity reaction is contact dermatitis?',
    options: ['Type I (IgE-mediated)', 'Type II (Cytotoxic)', 'Type III (Immune complex)', 'Type IV (Delayed/Cell-mediated)'],
    correct_index: 3,
    explanation: 'Contact dermatitis is a Type IV (delayed-type) hypersensitivity reaction mediated by sensitized T lymphocytes, not antibodies.',
    subject: 'Immunology',
    topic: 'Hypersensitivity',
    difficulty: 'hard',
  },
  {
    question: 'The enzyme deficient in Phenylketonuria (PKU) is:',
    options: ['Phenylalanine hydroxylase', 'Tyrosinase', 'Homogentisate oxidase', 'Fumarylacetoacetase'],
    correct_index: 0,
    explanation: 'PKU is caused by deficiency of phenylalanine hydroxylase, leading to accumulation of phenylalanine and its toxic metabolites.',
    subject: 'Biochemistry',
    topic: 'Amino Acid Metabolism',
    difficulty: 'medium',
  },
  {
    question: 'Which of the following is NOT a feature of nephrotic syndrome?',
    options: ['Proteinuria > 3.5g/day', 'Hypoalbuminemia', 'Hematuria', 'Edema'],
    correct_index: 2,
    explanation: 'Hematuria is a feature of nephrITIC syndrome, not nephrOTIC syndrome. Nephrotic syndrome is characterized by massive proteinuria, hypoalbuminemia, and edema.',
    subject: 'Medicine',
    topic: 'Renal Diseases',
    difficulty: 'hard',
  },
];

@Injectable()
export class QuizService {
  constructor(private supabaseService: SupabaseService) {}

  async generateQuiz(
    userId: string,
    subject: string,
    numQuestions: number = 5,
    difficulty: string = 'mixed',
  ) {
    // Filter questions by subject if specified
    let pool = subject && subject !== 'all'
      ? QUESTION_BANK.filter(q => q.subject.toLowerCase() === subject.toLowerCase())
      : [...QUESTION_BANK];

    // Filter by difficulty
    if (difficulty !== 'mixed') {
      pool = pool.filter(q => q.difficulty === difficulty);
    }

    // Fall back to full bank if filtered pool is too small
    if (pool.length < numQuestions) {
      pool = [...QUESTION_BANK];
    }

    // Shuffle and pick
    const shuffled = pool.sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(numQuestions, shuffled.length));

    // Format for storing — strip correct_index from client view
    const questionsForClient = selected.map(q => ({
      question: q.question,
      options: q.options,
      subject: q.subject,
      topic: q.topic,
      difficulty: q.difficulty,
    }));

    // Store the full quiz (with answers) in Supabase
    const supabase = this.supabaseService.getClient();
    const { data: quiz, error } = await supabase
      .from('quizzes')
      .insert({
        user_id: userId,
        subject: subject || 'Mixed',
        topic: null,
        questions: selected, // full data including answers stored server-side
        total: selected.length,
        difficulty,
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to create quiz: ${error.message}`);

    return {
      quiz_id: quiz.id,
      questions: questionsForClient, // no correct answers sent to client
      total: selected.length,
      subject: subject || 'Mixed',
      difficulty,
    };
  }

  async submitQuiz(
    userId: string,
    quizId: string,
    answers: number[], // array of selected option indices
    timeTakenSeconds: number,
  ) {
    const supabase = this.supabaseService.getClient();

    // Fetch the quiz with stored correct answers
    const { data: quiz, error } = await supabase
      .from('quizzes')
      .select('*')
      .eq('id', quizId)
      .eq('user_id', userId)
      .single();

    if (error || !quiz) throw new NotFoundException('Quiz not found');
    if (quiz.completed_at) throw new Error('Quiz already submitted');

    const storedQuestions: QuizQuestion[] = quiz.questions;
    let score = 0;
    const answerRecords = [];

    for (let i = 0; i < storedQuestions.length; i++) {
      const q = storedQuestions[i];
      const selectedIndex = answers[i];
      const isCorrect = selectedIndex === q.correct_index;
      if (isCorrect) score++;

      answerRecords.push({
        quiz_id: quizId,
        user_id: userId,
        question_index: i,
        question_text: q.question,
        selected_option: q.options[selectedIndex] ?? null,
        correct_option: q.options[q.correct_index],
        is_correct: isCorrect,
        subject: q.subject,
        topic: q.topic,
      });
    }

    // Save individual answers
    await supabase.from('quiz_answers').insert(answerRecords);

    // Update quiz with score
    await supabase
      .from('quizzes')
      .update({ score, completed_at: new Date().toISOString(), time_taken_seconds: timeTakenSeconds })
      .eq('id', quizId);

    // Update topic_mastery for each topic answered
    await this.updateTopicMastery(userId, answerRecords);

    // Build result with explanations
    const results = storedQuestions.map((q, i) => ({
      question: q.question,
      options: q.options,
      selected_index: answers[i],
      correct_index: q.correct_index,
      is_correct: answers[i] === q.correct_index,
      explanation: q.explanation,
      subject: q.subject,
      topic: q.topic,
    }));

    return {
      score,
      total: storedQuestions.length,
      percentage: Math.round((score / storedQuestions.length) * 100),
      time_taken_seconds: timeTakenSeconds,
      results,
    };
  }

  private async updateTopicMastery(userId: string, answerRecords: any[]) {
    const supabase = this.supabaseService.getClient();

    // Group by topic
    const topicMap = new Map<string, { subject: string; correct: number; total: number }>();
    for (const a of answerRecords) {
      const key = `${a.subject}::${a.topic}`;
      const existing = topicMap.get(key) || { subject: a.subject, correct: 0, total: 0 };
      existing.total++;
      if (a.is_correct) existing.correct++;
      topicMap.set(key, existing);
    }

    for (const [key, data] of topicMap.entries()) {
      const topic = key.split('::')[1];

      // Check if mastery record exists
      const { data: existing } = await supabase
        .from('topic_mastery')
        .select('*')
        .eq('user_id', userId)
        .eq('subject', data.subject)
        .eq('topic', topic)
        .single();

      if (existing) {
        const newSeen = existing.questions_seen + data.total;
        const newCorrect = existing.questions_correct + data.correct;
        const newScore = Math.round((newCorrect / newSeen) * 100);

        await supabase
          .from('topic_mastery')
          .update({
            mastery_score: newScore,
            questions_seen: newSeen,
            questions_correct: newCorrect,
            last_practiced: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('id', existing.id);
      } else {
        const newScore = Math.round((data.correct / data.total) * 100);
        await supabase.from('topic_mastery').insert({
          user_id: userId,
          subject: data.subject,
          topic,
          mastery_score: newScore,
          questions_seen: data.total,
          questions_correct: data.correct,
          last_practiced: new Date().toISOString(),
        });
      }
    }
  }

  async getHistory(userId: string) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('quizzes')
      .select('id, subject, topic, score, total, difficulty, completed_at, created_at, time_taken_seconds')
      .eq('user_id', userId)
      .not('completed_at', 'is', null)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) throw new Error(error.message);
    return data || [];
  }
}
