'use client';

import React, { useEffect, useState } from 'react';
import { dashboardService } from '@/services/dashboard.service';
import { analyticsService } from '@/services/analytics.service';
import { quizService } from '@/services/quiz.service';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { Target, CheckCircle2, TrendingUp, Activity, AlertCircle, ArrowRight, Zap, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const router = useRouter();
  const [summary, setSummary] = useState<any>(null);
  const [activity, setActivity] = useState<any[]>([]);
  const [mastery, setMastery] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGeneratingTargeted, setIsGeneratingTargeted] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem('arivu_token');
      if (!token) return;

      try {
        setLoading(true);
        const [sumRes, actRes, masteryRes] = await Promise.all([
          dashboardService.getSummary(),
          dashboardService.getActivity(),
          analyticsService.getMastery()
        ]);
        
        setSummary(sumRes);
        setActivity(actRes || []);
        setMastery(masteryRes);
        setError(null);
      } catch (err: any) {
        console.error('Failed to fetch dashboard data', err);
        if (err.response?.status !== 401) {
          setError('Could not load study data.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleStartTargetedQuiz = async () => {
    setIsGeneratingTargeted(true);
    try {
      const quiz = await quizService.generateTargeted();
      router.push(`/quizzes/${quiz.quiz_id}`);
    } catch (err) {
      alert('Failed to generate targeted quiz. Try taking some regular quizzes first!');
    } finally {
      setIsGeneratingTargeted(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-sans font-bold text-medical-brown tracking-tight">Dashboard</h1>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard 
          title="Total Questions" 
          value={summary?.totalQuestions} 
          icon={CheckCircle2} 
          color="text-medical-teal" 
          loading={loading}
        />
        <KpiCard 
          title="Average Quiz Score" 
          value={summary ? `${summary.averageScore}%` : null} 
          icon={Target} 
          color="text-medical-teal" 
          loading={loading}
        />
        <KpiCard 
          title="Overall Mastery" 
          value={summary ? `${summary.overallMastery}%` : null} 
          icon={TrendingUp} 
          color="text-green-600" 
          loading={loading}
        />
        <KpiCard 
          title="Case Sessions" 
          value={summary?.casesCompleted} 
          icon={Activity} 
          color="text-medical-teal" 
          loading={loading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Activity Chart */}
        <div className="lg:col-span-2 medical-card p-6 min-h-[350px]">
          <h2 className="text-lg font-serif font-bold mb-4 text-medical-brown">Study Activity (Last 7 Days)</h2>
          {loading ? (
            <div className="w-full h-64 skeleton rounded-lg" />
          ) : (
            <div style={{ width: '100%', height: 256 }}>
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <BarChart data={activity} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e1db" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#7a7974' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#7a7974' }} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Bar dataKey="questions" fill="#01696f" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Action Suggestions & Weak Topics */}
        <div className="space-y-6">
          
          <div className="medical-card p-6 bg-red-50/30 border-red-100">
            <h2 className="text-lg font-serif font-bold mb-3 text-red-700 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" /> Targeted Revision
            </h2>
            {loading ? (
              <div className="space-y-2">
                <div className="h-4 w-full skeleton" />
                <div className="h-8 w-full skeleton mt-4" />
              </div>
            ) : mastery?.weakTopics?.length > 0 ? (
              <div className="space-y-3 mt-4 text-sm">
                <p className="text-medical-brown/80">
                  You have <b>{mastery.stats.weakTopicsCount}</b> weak areas identified. Focus on {mastery.weakTopics[0].topic} to improve your score.
                </p>
                <Button 
                  onClick={handleStartTargetedQuiz} 
                  disabled={isGeneratingTargeted}
                  className="w-full mt-2 bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
                >
                  <Zap className="w-4 h-4 fill-white" />
                  {isGeneratingTargeted ? 'Generating...' : 'Practice Weak Areas'}
                </Button>
                <Link href="/errors" className="block text-center text-xs text-medical-muted underline p-1">View Recent Mistakes</Link>
              </div>
            ) : (
              <p className="text-sm text-medical-muted mt-2">Take more quizzes to identify areas for improvement.</p>
            )}
          </div>

          <div className="medical-card p-6">
            <h2 className="text-lg font-serif font-bold mb-4 text-medical-brown">Topics to Revise</h2>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex justify-between items-center">
                    <div className="space-y-2 w-1/2">
                      <div className="h-4 w-full skeleton" />
                      <div className="h-3 w-1/2 skeleton" />
                    </div>
                    <div className="h-6 w-10 skeleton" />
                  </div>
                ))}
              </div>
            ) : mastery?.weakTopics?.length > 0 ? (
              <div className="space-y-3">
                {mastery.weakTopics.map((topic: any, i: number) => (
                  <div key={i} className="flex items-center justify-between group p-2 hover:bg-black/5 rounded-md transition-colors">
                    <div>
                      <p className="text-sm font-medium text-medical-brown">{topic.topic}</p>
                      <p className="text-xs text-medical-muted">{topic.subject}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-bold text-red-500">{topic.mastery_score}%</span>
                      <Link href={`/tutor?topic=${encodeURIComponent(topic.topic)}`} className="text-medical-teal opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-medical-muted text-sm">
                <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-green-500 opacity-50" />
                <p>No weak topics detected yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ title, value, icon: Icon, color, loading }: { title: string, value: string | number | null | undefined, icon: any, color: string, loading?: boolean }) {
  return (
    <div className="medical-card p-5 flex items-center justify-between min-h-[100px]">
      <div className="flex-1">
        <p className="text-sm text-medical-muted font-medium mb-1">{title}</p>
        {loading ? (
          <div className="h-9 w-20 skeleton mt-1" />
        ) : (
          <p className="text-3xl font-mono font-bold text-medical-brown">{value ?? 0}</p>
        )}
      </div>
      <div className={`p-3 rounded-full bg-black/5 border border-black/5 shrink-0 ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
}
