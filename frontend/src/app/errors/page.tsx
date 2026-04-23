'use client';

import React, { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { analyticsService, ErrorLogRecord } from '@/services/analytics.service';
import { AlertCircle, BookOpen, ChevronRight, XCircle } from 'lucide-react';
import Link from 'next/link';

export default function ErrorLogPage() {
  const [errors, setErrors] = useState<ErrorLogRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchErrors = async () => {
      try {
        const data = await analyticsService.getErrorLog();
        setErrors(data);
      } catch (err) {
        console.error('Failed to fetch error log:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchErrors();
  }, []);

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <h1 className="text-3xl font-serif font-bold text-medical-brown">Error Log</h1>
          </div>
          <p className="text-medical-muted text-lg">
            Every incorrect answer from your quizzes is saved here. Use this to identify patterns in your understanding and focus your revision.
          </p>
        </header>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 w-full skeleton"></div>
            ))}
          </div>
        ) : errors.length === 0 ? (
          <div className="medical-card p-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <XCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-medical-brown">No errors yet!</h3>
            <p className="text-medical-muted mt-2 max-w-md">
              Great job! You haven't made any mistakes in your quizzes yet. Keep practicing to maintain your mastery.
            </p>
            <Link href="/quizzes" className="mt-6 btn-primary">Take a Quiz</Link>
          </div>
        ) : (
          <div className="space-y-6">
            {errors.map((err) => (
              <div key={err.id} className="medical-card p-6 border-l-4 border-l-red-500">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider px-2 py-1 bg-red-50 text-red-700 rounded border border-red-100">
                      {err.subject}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider px-2 py-1 bg-gray-100 text-gray-700 rounded border border-gray-200">
                      {err.topic}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(err.created_at).toLocaleDateString()}
                  </span>
                </div>
                
                <h4 className="text-lg font-bold text-medical-brown mb-3">{err.question_text}</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-red-50/50 p-4 rounded-lg border border-red-100">
                    <p className="text-xs font-bold text-red-700 uppercase mb-1">Your Answer</p>
                    <p className="text-sm font-medium text-red-800">{err.selected_option || '(Skipped)'}</p>
                  </div>
                  <div className="bg-green-50/50 p-4 rounded-lg border border-green-100">
                    <p className="text-xs font-bold text-green-700 uppercase mb-1">Correct Answer</p>
                    <p className="text-sm font-medium text-green-800">{err.correct_option}</p>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <Link 
                    href={`/tutor?q=Explain the concept of ${err.topic} in ${err.subject}`}
                    className="flex items-center gap-2 text-xs font-bold text-medical-teal hover:underline"
                  >
                    Review Topic <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
