'use client';

import React, { useEffect, useState } from 'react';
import { dashboardService } from '@/services/dashboard.service';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { Target, CheckCircle2, TrendingUp, Activity, AlertCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const [summary, setSummary] = useState<any>(null);
  const [activity, setActivity] = useState<any[]>([]);
  const [weakTopics, setWeakTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [sumRes, actRes, weakRes] = await Promise.all([
          dashboardService.getSummary(),
          dashboardService.getActivity(),
          dashboardService.getWeakTopics()
        ]);
        setSummary(sumRes);
        setActivity(actRes);
        setWeakTopics(weakRes);
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Activity className="w-8 h-8 text-medical-teal animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-md medical-card">
        <p>{error}</p>
        <Button onClick={() => window.location.reload()} className="mt-4" variant="outline">Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-serif font-bold text-medical-brown">Dashboard</h1>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard 
          title="Total Questions" 
          value={summary?.totalQuestions || 0} 
          icon={CheckCircle2} 
          color="text-medical-teal" 
        />
        <KpiCard 
          title="Average Quiz Score" 
          value={`${summary?.averageScore || 0}%`} 
          icon={Target} 
          color="text-medical-teal" 
        />
        <KpiCard 
          title="Overall Mastery" 
          value={`${summary?.overallMastery || 0}%`} 
          icon={TrendingUp} 
          color="text-green-600" 
        />
        <KpiCard 
          title="Case Sessions" 
          value={summary?.casesCompleted || 0} 
          icon={Activity} 
          color="text-medical-teal" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Activity Chart */}
        <div className="lg:col-span-2 medical-card p-6">
          <h2 className="text-lg font-serif font-bold mb-4 text-medical-brown">Study Activity (Last 7 Days)</h2>
          {/* Fixed: explicit pixel height fixes recharts width/height=-1 warning */}
          <div style={{ width: '100%', height: 256 }}>
            <ResponsiveContainer width="100%" height="100%">
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
        </div>

        {/* Action Suggestions & Weak Topics */}
        <div className="space-y-6">
          
          <div className="medical-card p-6 bg-medical-teal/5 border-medical-teal/20">
            <h2 className="text-lg font-serif font-bold mb-3 text-medical-teal flex items-center gap-2">
              <AlertCircle className="w-5 h-5" /> Suggested Actions
            </h2>
            <div className="space-y-3 mt-4 text-sm">
              <p className="flex items-start gap-2 text-medical-brown/80">
                <span className="w-1.5 h-1.5 rounded-full bg-medical-teal mt-1.5 shrink-0" />
                You haven&apos;t reviewed Pharmacology in 7 days — take a quick quiz.
              </p>
              <Link href="/quizzes">
                <Button size="sm" variant="outline" className="w-full mt-2 text-xs h-8">Start Quiz</Button>
              </Link>
            </div>
          </div>

          <div className="medical-card p-6">
            <h2 className="text-lg font-serif font-bold mb-4 text-medical-brown">Topics to Revise</h2>
            {weakTopics.length > 0 ? (
              <div className="space-y-3">
                {weakTopics.map((topic, i) => (
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

function KpiCard({ title, value, icon: Icon, color }: { title: string, value: string | number, icon: any, color: string }) {
  return (
    <div className="medical-card p-5 flex items-center justify-between">
      <div>
        <p className="text-sm text-medical-muted font-medium mb-1">{title}</p>
        <p className="text-3xl font-mono font-bold text-medical-brown">{value}</p>
      </div>
      <div className={`p-3 rounded-full bg-black/5 border border-black/5 ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
}
