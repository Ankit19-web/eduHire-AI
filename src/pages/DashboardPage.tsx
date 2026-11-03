import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';
import {
  Sparkles,
  Award,
  Clock,
  TrendingUp,
  FileText,
  Terminal,
  Calendar,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  PlayCircle,
  ExternalLink,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
} from 'recharts';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics/dashboard')
      .then((res) => res.json())
      .then((data) => {
        setAnalytics(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load dashboard analytics:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm">Synthesizing candidate performance metrics...</p>
        </div>
      </div>
    );
  }

  const metrics = analytics?.metrics || {
    totalInterviewsCompleted: 3,
    averageScore: 84,
    totalHoursPracticed: 6.5,
    readinessIndex: '88% - Strong Candidate',
  };

  const performanceTrend = analytics?.performanceTrend || [];
  const skillBreakdown = analytics?.skillBreakdown || [];
  const strongestSkills = analytics?.strongestSkills || [];
  const weakestSkills = analytics?.weakestSkills || [];
  const recentInterviews = analytics?.recentInterviews || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Welcome & Primary CTA Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="space-y-1">
          <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            Candidate Overview
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Welcome back, {user?.name || 'Alex Rivera'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Targeting: <span className="font-medium text-slate-800 dark:text-slate-200">{user?.targetRole || 'Senior Java Developer'}</span> ({user?.experienceLevel || 'Mid-Level'})
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/interview/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-colors whitespace-nowrap"
          >
            <Sparkles className="w-4 h-4" />
            <span>Start New Interview</span>
          </Link>
          <Link
            to="/coding"
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-medium rounded-lg text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors whitespace-nowrap"
          >
            <Terminal className="w-4 h-4" />
            <span>Monaco Coding Lab</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Interviews Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="font-mono text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
            {metrics.totalInterviewsCompleted}
          </div>
          <p className="text-[11px] text-slate-500">Across Technical & Coding</p>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Average Score</span>
            <Award className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="font-mono text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
            {metrics.averageScore}<span className="text-xs font-normal text-slate-400">/100</span>
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">+12 pts from initial baseline</p>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Practice Duration</span>
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
          <div className="font-mono text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
            {metrics.totalHoursPracticed} hrs
          </div>
          <p className="text-[11px] text-slate-500">Active verbal & coding time</p>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Readiness Index</span>
            <TrendingUp className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white truncate">
            {metrics.readinessIndex}
          </div>
          <p className="text-[11px] text-slate-500">Top 15th percentile</p>
        </div>
      </div>

      {/* Analytics Charts Split */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Performance Trajectory Line Chart */}
        <div className="lg:col-span-7 p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                Score Progression Over Time
              </h2>
              <p className="text-xs text-slate-500">
                Evaluation trajectory across consecutive mock interviews
              </p>
            </div>
            <span className="text-xs font-mono font-medium text-emerald-600 dark:text-emerald-400">
              Positive Growth Trend
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis domain={[50, 100]} tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#fff',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#6366f1"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#6366f1' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Skill Mastery Bar Chart */}
        <div className="lg:col-span-5 p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                Skill Mastery vs Benchmark
              </h2>
              <p className="text-xs text-slate-500">
                Candidate score vs industry standard (72)
              </p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={skillBreakdown} layout="vertical" margin={{ top: 5, right: 10, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} horizontal={false} />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
                <YAxis dataKey="skill" type="category" width={110} tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#fff',
                  }}
                />
                <Bar dataKey="score" fill="#6366f1" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Strongest vs Weakest Skills & Recommended Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Strongest Skills */}
        <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Demonstrated Strengths
            </h3>
          </div>
          <ul className="space-y-2.5 text-xs">
            {strongestSkills.map((skill: string, idx: number) => (
              <li key={idx} className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span>{skill}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Weakest Skills / Focus Areas */}
        <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Priority Improvement Areas
              </h3>
            </div>
            <Link
              to="/roadmap"
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>View 7-Day Plan</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <ul className="space-y-2.5 text-xs">
            {weakestSkills.map((skill: string, idx: number) => (
              <li key={idx} className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <span>{skill}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recent Interviews List */}
      <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              Recent Interview Sessions
            </h2>
            <p className="text-xs text-slate-500">
              Review transcripts, question evaluations, and diagnostic reports
            </p>
          </div>
          <Link
            to="/interview/new"
            className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Create Session
          </Link>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {recentInterviews.map((session: any) => (
            <div key={session.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">
                    {session.title}
                  </span>
                  <span className="text-xs text-slate-500">
                    · {session.interviewType.toUpperCase()}
                  </span>
                  <span className="text-xs text-slate-500">
                    · {session.difficulty}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span>{new Date(session.createdAt).toLocaleDateString()}</span>
                  <span aria-hidden="true">·</span>
                  <span>{session.questions?.length || 4} Questions</span>
                  <span aria-hidden="true">·</span>
                  <span>{session.technologies?.slice(0, 3).join(', ')}</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="font-mono text-base font-bold text-slate-900 dark:text-white tabular-nums">
                    {session.overallScore ? `${session.overallScore}/100` : 'In Progress'}
                  </div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider">
                    Overall Score
                  </div>
                </div>

                <Link
                  to={`/report/${session.id}`}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors inline-flex items-center gap-1.5 whitespace-nowrap"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Report</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
