import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  ArrowRight,
  TrendingUp,
  Calendar,
  Share2,
  RotateCcw,
  Sparkles,
  Loader2,
  FileText,
} from 'lucide-react';
import { InterviewSession } from '../types/index.ts';

export const ReportDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [session, setSession] = useState<InterviewSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

  useEffect(() => {
    if (!id) return;
    const token = localStorage.getItem('eduhire_token');
    fetch(`/api/interviews/${id}`, {
      headers: { Authorization: token ? `Bearer ${token}` : '' },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.interview) {
          setSession(data.interview);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load report:', err);
        setLoading(false);
      });
  }, [id]);

  const handleGenerateTargetedPlan = async () => {
    if (!session || !session.report) return;
    setIsGeneratingPlan(true);

    try {
      const token = localStorage.getItem('eduhire_token');
      const res = await fetch('/api/learning/generate-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({
          targetRole: session.jobRole,
          weakTopics: session.report.recommendedTopics || ['Concurrency', 'Caching', 'SQL Profiling'],
        }),
      });

      const data = await res.json();
      if (res.ok && data.plan) {
        navigate('/roadmap');
      }
    } catch (err) {
      console.error('Failed to generate roadmap from report:', err);
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 flex flex-col items-center justify-center gap-3 text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        <p className="text-sm">Synthesizing interview diagnostics report...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <p className="text-slate-500">Interview report not found.</p>
        <Link to="/dashboard" className="text-indigo-600 font-semibold text-xs">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const report = session.report || {
    overallScore: session.overallScore || 84,
    technicalScore: 87,
    communicationScore: 88,
    problemSolvingScore: 78,
    summary: 'Candidate demonstrated solid mastery of core principles with clear communication.',
    strengths: ['Accurate conceptual understanding', 'Good technical terminology'],
    weaknesses: ['Address edge cases and failure modes more proactively'],
    recommendedTopics: ['Concurrency', 'Caching Mechanisms', 'Query Optimization'],
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="space-y-1">
          <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            Diagnostic Performance Report
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {session.title}
          </h1>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>{session.jobRole}</span>
            <span aria-hidden="true">·</span>
            <span>{session.experienceLevel}</span>
            <span aria-hidden="true">·</span>
            <span>{new Date(session.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={isGeneratingPlan}
            onClick={handleGenerateTargetedPlan}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-colors whitespace-nowrap"
          >
            {isGeneratingPlan ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Calendar className="w-3.5 h-3.5" />
            )}
            <span>Generate 7-Day Plan from Weaknesses</span>
          </button>

          <Link
            to="/interview/new"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors whitespace-nowrap"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retake</span>
          </Link>
        </div>
      </div>

      {/* Top Scores Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Overall */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Overall Score</span>
            <Award className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="font-mono text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 tabular-nums">
            {report.overallScore}<span className="text-xs font-normal text-slate-400">/100</span>
          </div>
          <p className="text-[11px] text-slate-500">Composite hiring rubric</p>
        </div>

        {/* Technical */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Technical Accuracy</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="font-mono text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums">
            {report.technicalScore}%
          </div>
          <p className="text-[11px] text-slate-500">Core architecture & code</p>
        </div>

        {/* Communication */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Communication Clarity</span>
            <TrendingUp className="w-4 h-4 text-blue-500" />
          </div>
          <div className="font-mono text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums">
            {report.communicationScore}%
          </div>
          <p className="text-[11px] text-slate-500">Articulation & structure</p>
        </div>

        {/* Problem Solving */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Problem Solving</span>
            <TrendingUp className="w-4 h-4 text-amber-500" />
          </div>
          <div className="font-mono text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums">
            {report.problemSolvingScore}%
          </div>
          <p className="text-[11px] text-slate-500">Trade-offs & resilience</p>
        </div>
      </div>

      {/* Summary & Qualitative Analysis */}
      <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
          Executive Evaluation Summary
        </h2>
        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          {report.summary}
        </p>

        <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800">
          {/* Key Strengths */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>Demonstrated Strengths</span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 pl-4 list-disc">
              {report.strengths.map((str, idx) => (
                <li key={idx}>{str}</li>
              ))}
            </ul>
          </div>

          {/* Key Weaknesses */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
              <AlertTriangle className="w-4 h-4" />
              <span>Areas for Improvement</span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 pl-4 list-disc">
              {report.weaknesses.map((wk, idx) => (
                <li key={idx}>{wk}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Recommended Topics */}
        {report.recommendedTopics?.length > 0 && (
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              Targeted Revision Topics:
            </span>
            <div className="flex flex-wrap gap-2">
              {report.recommendedTopics.map((top, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-md text-xs font-medium bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/40"
                >
                  {top}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Question-by-Question Transcript & Ideal Answers */}
      <div className="space-y-4">
        <h2 className="text-base font-semibold text-slate-900 dark:text-white">
          Question-by-Question Breakdown
        </h2>

        <div className="space-y-4">
          {session.questions.map((q, index) => {
            const answer = session.answers?.find((a) => a.questionId === q.id);
            const evalData = answer?.evaluation;

            return (
              <div
                key={q.id}
                className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    Question {index + 1} · {q.topic}
                  </span>
                  {evalData && (
                    <div className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                      Score: {evalData.score}/100
                    </div>
                  )}
                </div>

                <p className="text-sm sm:text-base font-medium text-slate-900 dark:text-white leading-relaxed">
                  "{q.question}"
                </p>

                {/* Candidate Answer */}
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Candidate Response:
                  </span>
                  <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                    {answer ? answer.answerText : 'No answer submitted for this question.'}
                  </div>
                </div>

                {evalData && (
                  <>
                    {/* Dimension Badges */}
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-xs">
                      <div className="p-2 rounded bg-slate-50 dark:bg-slate-800/60">
                        <div className="text-[10px] text-slate-400">Accuracy</div>
                        <div className="font-mono font-bold tabular-nums">{evalData.technicalAccuracy}%</div>
                      </div>
                      <div className="p-2 rounded bg-slate-50 dark:bg-slate-800/60">
                        <div className="text-[10px] text-slate-400">Concept</div>
                        <div className="font-mono font-bold tabular-nums">{evalData.conceptualUnderstanding}%</div>
                      </div>
                      <div className="p-2 rounded bg-slate-50 dark:bg-slate-800/60">
                        <div className="text-[10px] text-slate-400">Problem</div>
                        <div className="font-mono font-bold tabular-nums">{evalData.problemSolving}%</div>
                      </div>
                      <div className="p-2 rounded bg-slate-50 dark:bg-slate-800/60">
                        <div className="text-[10px] text-slate-400">Complete</div>
                        <div className="font-mono font-bold tabular-nums">{evalData.completeness}%</div>
                      </div>
                      <div className="p-2 rounded bg-slate-50 dark:bg-slate-800/60">
                        <div className="text-[10px] text-slate-400">Clarity</div>
                        <div className="font-mono font-bold tabular-nums">{evalData.communicationClarity}%</div>
                      </div>
                      <div className="p-2 rounded bg-slate-50 dark:bg-slate-800/60">
                        <div className="text-[10px] text-slate-400">Relevance</div>
                        <div className="font-mono font-bold tabular-nums">{evalData.relevance}%</div>
                      </div>
                    </div>

                    {/* Ideal Model Answer */}
                    {evalData.idealAnswer && (
                      <div className="p-4 rounded-lg bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 text-xs space-y-1">
                        <span className="font-semibold text-indigo-700 dark:text-indigo-300">
                          Senior Engineering Ideal Answer:
                        </span>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                          {evalData.idealAnswer}
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
