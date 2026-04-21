'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { quizService, GeneratedQuiz, QuizResult, QuizHistoryItem } from '@/services/quiz.service';
import { Button } from '@/components/ui/button';
import {
  CheckCircle2, XCircle, Clock, Trophy, BookOpen,
  ChevronRight, RotateCcw, BarChart2, Flame, Target
} from 'lucide-react';

type QuizPhase = 'setup' | 'taking' | 'results' | 'history';

const SUBJECTS = ['all', 'Physiology', 'Anatomy', 'Pharmacology', 'Pathology', 'Biochemistry', 'Microbiology', 'Medicine', 'Immunology'];
const DIFFICULTIES = ['mixed', 'easy', 'medium', 'hard'];

export default function QuizzesPage() {
  const [phase, setPhase] = useState<QuizPhase>('setup');
  const [quiz, setQuiz] = useState<GeneratedQuiz | null>(null);
  const [results, setResults] = useState<QuizResult | null>(null);
  const [history, setHistory] = useState<QuizHistoryItem[]>([]);

  // Setup state
  const [subject, setSubject] = useState('all');
  const [numQuestions, setNumQuestions] = useState(5);
  const [difficulty, setDifficulty] = useState('mixed');
  const [isGenerating, setIsGenerating] = useState(false);

  // Taking state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  // Timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (timerActive) {
      interval = setInterval(() => setElapsed(e => e + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  useEffect(() => {
    quizService.getHistory().then(setHistory).catch(console.error);
  }, [phase]);

  const handleStartQuiz = async () => {
    setIsGenerating(true);
    try {
      const generated = await quizService.generateQuiz(subject, numQuestions, difficulty);
      setQuiz(generated);
      setSelectedAnswers([]);
      setSelectedOption(null);
      setCurrentIndex(0);
      setElapsed(0);
      setTimerActive(true);
      setPhase('taking');
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectOption = (index: number) => {
    if (selectedAnswers[currentIndex] !== undefined) return; // already answered
    setSelectedOption(index);
  };

  const handleNext = () => {
    if (selectedOption === null) return;
    const newAnswers = [...selectedAnswers];
    newAnswers[currentIndex] = selectedOption;
    setSelectedAnswers(newAnswers);

    if (currentIndex < (quiz?.questions.length ?? 0) - 1) {
      setCurrentIndex(i => i + 1);
      setSelectedOption(null);
    } else {
      // last question — submit
      handleSubmit(newAnswers);
    }
  };

  const handleSubmit = async (finalAnswers: number[]) => {
    if (!quiz) return;
    setIsSubmitting(true);
    setTimerActive(false);
    try {
      const result = await quizService.submitQuiz(quiz.quiz_id, finalAnswers, elapsed);
      setResults(result);
      setPhase('results');
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  // ── SETUP PHASE ──────────────────────────────────────────────────────────────
  if (phase === 'setup' || phase === 'history') {
    return (
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-sans font-bold text-medical-brown tracking-tight">Quiz Arena</h1>
          <div className="flex gap-2">
            <Button
              variant={phase === 'setup' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setPhase('setup')}
            >New Quiz</Button>
            <Button
              variant={phase === 'history' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setPhase('history')}
            ><BarChart2 className="w-4 h-4 mr-1" />History</Button>
          </div>
        </div>

        {phase === 'setup' ? (
          <div className="medical-card p-8 space-y-6">
            <h2 className="text-xl font-sans font-bold text-medical-brown tracking-tight">Configure Your Quiz</h2>

            <div className="space-y-2">
              <label className="text-sm font-medium text-medical-brown/80">Subject</label>
              <div className="flex flex-wrap gap-2">
                {SUBJECTS.map(s => (
                  <button
                    key={s}
                    onClick={() => setSubject(s)}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-all capitalize ${
                      subject === s
                        ? 'bg-medical-teal text-white border-medical-teal'
                        : 'border-medical-brown/20 text-medical-brown/70 hover:border-medical-teal hover:text-medical-teal'
                    }`}
                  >{s}</button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-medical-brown/80">
                Number of Questions: <span className="text-medical-teal font-bold">{numQuestions}</span>
              </label>
              <input
                type="range" min={3} max={10} value={numQuestions}
                onChange={e => setNumQuestions(Number(e.target.value))}
                className="w-full accent-medical-teal"
              />
              <div className="flex justify-between text-xs text-medical-muted"><span>3</span><span>10</span></div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-medical-brown/80">Difficulty</label>
              <div className="flex gap-2">
                {DIFFICULTIES.map(d => (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={`px-4 py-2 rounded-md text-sm border transition-all capitalize flex-1 ${
                      difficulty === d
                        ? 'bg-medical-teal text-white border-medical-teal'
                        : 'border-medical-brown/20 text-medical-brown/70 hover:border-medical-teal hover:text-medical-teal'
                    }`}
                  >{d}</button>
                ))}
              </div>
            </div>

            <Button
              className="w-full h-12 text-base"
              onClick={handleStartQuiz}
              isLoading={isGenerating}
            >
              Start Quiz <ChevronRight className="w-5 h-5 ml-1" />
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {history.length === 0 ? (
              <div className="medical-card p-12 text-center text-medical-muted">
                <Trophy className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p>No quiz history yet. Take your first quiz!</p>
              </div>
            ) : (
              history.map(h => (
                <div key={h.id} className="medical-card p-4 flex items-center justify-between hover:shadow-md transition-all">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                      h.score / h.total >= 0.7 ? 'bg-green-500' : h.score / h.total >= 0.5 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}>
                      {Math.round(h.score / h.total * 100)}%
                    </div>
                    <div>
                      <p className="font-semibold text-medical-brown text-sm">{h.subject}</p>
                      <p className="text-xs text-medical-muted capitalize">{h.difficulty} · {h.total} Qs · {formatTime(h.time_taken_seconds)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-mono font-bold text-xl text-medical-brown">{h.score}/{h.total}</p>
                    <p className="text-xs text-medical-muted">{new Date(h.completed_at).toLocaleDateString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    );
  }

  // ── TAKING PHASE ─────────────────────────────────────────────────────────────
  if (phase === 'taking' && quiz) {
    const q = quiz.questions[currentIndex];
    const progress = ((currentIndex) / quiz.questions.length) * 100;
    const isAnswered = selectedAnswers[currentIndex] !== undefined;

    return (
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Progress header */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-medical-muted font-medium">
            Question <span className="text-medical-brown font-bold">{currentIndex + 1}</span> of {quiz.questions.length}
          </div>
          <div className="flex items-center gap-2 text-medical-teal font-mono font-bold">
            <Clock className="w-4 h-4" />
            {formatTime(elapsed)}
          </div>
        </div>

        <div className="w-full bg-medical-brown/10 rounded-full h-1.5">
          <div
            className="bg-medical-teal h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Metadata badge */}
        <div className="flex gap-2">
          <span className="text-xs px-2 py-1 bg-medical-teal/10 text-medical-teal rounded-full border border-medical-teal/20 capitalize">{q.subject}</span>
          <span className="text-xs px-2 py-1 bg-medical-brown/5 text-medical-muted rounded-full border border-medical-brown/10 capitalize">{q.difficulty}</span>
        </div>

        {/* Question card */}
        <div className="medical-card p-8">
          <p className="text-lg font-semibold text-medical-brown leading-relaxed mb-8">{q.question}</p>

          <div className="space-y-3">
            {q.options.map((opt, i) => {
              const isSelected = selectedOption === i;
              const isPrevAnswered = selectedAnswers[currentIndex] === i;

              return (
                <button
                  key={i}
                  onClick={() => handleSelectOption(i)}
                  disabled={isAnswered}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 group ${
                    isSelected || isPrevAnswered
                      ? 'border-medical-teal bg-medical-teal/5 text-medical-brown shadow-md'
                      : 'border-medical-brown/10 text-medical-brown/80 hover:border-medical-teal/40 hover:bg-medical-teal/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                      isSelected || isPrevAnswered
                        ? 'border-medical-teal bg-medical-teal text-white'
                        : 'border-medical-brown/20 text-medical-muted group-hover:border-medical-teal/40'
                    }`}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="text-sm leading-relaxed">{opt}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={handleNext}
            disabled={selectedOption === null || isSubmitting}
            isLoading={isSubmitting}
            className="px-8"
          >
            {currentIndex < quiz.questions.length - 1 ? (
              <>Next <ChevronRight className="w-4 h-4 ml-1" /></>
            ) : (
              'Submit Quiz'
            )}
          </Button>
        </div>
      </div>
    );
  }

  // ── RESULTS PHASE ─────────────────────────────────────────────────────────────
  if (phase === 'results' && results) {
    const pct = results.percentage;
    const scoreColor = pct >= 70 ? 'text-green-600' : pct >= 50 ? 'text-yellow-600' : 'text-red-500';
    const gradeBg = pct >= 70 ? 'bg-green-50 border-green-200' : pct >= 50 ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200';

    return (
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Score card */}
        <div className={`medical-card p-8 text-center border-2 ${gradeBg}`}>
          <Trophy className={`w-12 h-12 mx-auto mb-3 ${scoreColor}`} />
          <h1 className="text-4xl font-serif font-bold text-medical-brown mb-1">
            {results.score} / {results.total}
          </h1>
          <p className={`text-3xl font-mono font-bold ${scoreColor} mb-4`}>{pct}%</p>
          <div className="flex justify-center gap-6 text-sm text-medical-muted">
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {formatTime(results.time_taken_seconds)}</span>
            <span className="flex items-center gap-1 text-green-600"><CheckCircle2 className="w-4 h-4" /> {results.score} Correct</span>
            <span className="flex items-center gap-1 text-red-500"><XCircle className="w-4 h-4" /> {results.total - results.score} Wrong</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={() => setPhase('setup')}>
            <RotateCcw className="w-4 h-4 mr-2" /> New Quiz
          </Button>
          <Button variant="ghost" className="flex-1" onClick={() => setPhase('history')}>
            <BarChart2 className="w-4 h-4 mr-2" /> View History
          </Button>
        </div>

        {/* Detailed review */}
        <div className="space-y-4">
          <h2 className="text-xl font-sans font-bold text-medical-brown tracking-tight">Answer Review</h2>
          {results.results.map((r, i) => (
            <div key={i} className={`medical-card p-5 border-l-4 ${r.is_correct ? 'border-l-green-500' : 'border-l-red-500'}`}>
              <div className="flex items-start gap-3 mb-3">
                {r.is_correct
                  ? <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  : <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                }
                <p className="text-sm font-semibold text-medical-brown leading-snug">{r.question}</p>
              </div>
              <div className="ml-8 space-y-1.5">
                {r.options.map((opt, j) => (
                  <div key={j} className={`text-xs px-3 py-2 rounded-md ${
                    j === r.correct_index
                      ? 'bg-green-100 text-green-800 font-semibold'
                      : j === r.selected_index && !r.is_correct
                      ? 'bg-red-100 text-red-700 line-through'
                      : 'text-medical-muted'
                  }`}>
                    <span className="font-bold mr-2">{String.fromCharCode(65 + j)}.</span>{opt}
                  </div>
                ))}
                <p className="text-xs text-medical-muted/80 mt-2 pt-2 border-t border-medical-brown/10 italic leading-relaxed">
                  💡 {r.explanation}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
}
