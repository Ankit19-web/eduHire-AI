import React, { useState, useEffect } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  RotateCw,
  BookOpen,
  ChevronDown,
  Loader2,
} from 'lucide-react';
import { LearningPlan } from '../types/index.ts';

export const LearningPlanPage: React.FC = () => {
  const [plan, setPlan] = useState<LearningPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [expandedDay, setExpandedDay] = useState<number>(1);
  const [customWeakTopic, setCustomWeakTopic] = useState('');

  useEffect(() => {
    fetchPlan();
  }, []);

  const fetchPlan = () => {
    const token = localStorage.getItem('eduhire_token');
    fetch('/api/learning/plan', {
      headers: { Authorization: token ? `Bearer ${token}` : '' },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.plan) {
          setPlan(data.plan);
          // Default expand current in-progress day
          const activeDay = data.plan.days.find((d: any) => d.status === 'in-progress');
          if (activeDay) setExpandedDay(activeDay.day);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load plan:', err);
        setLoading(false);
      });
  };

  const handleToggleTask = async (dayNumber: number, taskId: string) => {
    if (!plan) return;

    // Optimistic local update
    const updatedDays = plan.days.map((d) => {
      if (d.day === dayNumber) {
        const updatedTasks = d.tasks.map((t) =>
          t.id === taskId ? { ...t, completed: !t.completed } : t
        );
        const allCompleted = updatedTasks.every((t) => t.completed);
        const someCompleted = updatedTasks.some((t) => t.completed);
        return {
          ...d,
          tasks: updatedTasks,
          status: (allCompleted ? 'completed' : someCompleted ? 'in-progress' : 'pending') as any,
        };
      }
      return d;
    });

    setPlan({ ...plan, days: updatedDays });

    try {
      const token = localStorage.getItem('eduhire_token');
      await fetch('/api/learning/toggle-task', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({
          planId: plan.id,
          dayNumber,
          taskId,
        }),
      });
    } catch (err) {
      console.error('Failed to toggle task:', err);
    }
  };

  const handleGenerateNewPlan = async (topics?: string[]) => {
    setIsRegenerating(true);
    try {
      const token = localStorage.getItem('eduhire_token');
      const weakTopics = topics || (customWeakTopic ? [customWeakTopic] : ['Redis Caching Stampede', 'JVM G1 GC Pauses', 'PostgreSQL Deadlocks']);
      const res = await fetch('/api/learning/generate-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({
          targetRole: plan?.targetRole || 'Senior Java Developer',
          weakTopics,
        }),
      });

      const data = await res.json();
      if (res.ok && data.plan) {
        setPlan(data.plan);
        setExpandedDay(1);
        setCustomWeakTopic('');
      }
    } catch (err) {
      console.error('Error generating plan:', err);
    } finally {
      setIsRegenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 flex flex-col items-center justify-center gap-3 text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        <p className="text-sm">Synthesizing personalized preparation roadmap...</p>
      </div>
    );
  }

  // Calculate total tasks completed
  const totalTasks = plan?.days.reduce((acc, d) => acc + d.tasks.length, 0) || 14;
  const completedTasks =
    plan?.days.reduce((acc, d) => acc + d.tasks.filter((t) => t.completed).length, 0) || 3;
  const progressPercent = Math.round((completedTasks / totalTasks) * 100);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="space-y-1">
          <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            Personalized Turnaround Engine
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {plan?.title || '7-Day Senior Engineering Roadmap'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Tailored study curriculum dynamically formulated from your lowest-scoring interview topics.
          </p>
        </div>

        <button
          type="button"
          disabled={isRegenerating}
          onClick={() => handleGenerateNewPlan()}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-colors whitespace-nowrap self-start sm:self-auto disabled:opacity-50"
        >
          {isRegenerating ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <RotateCw className="w-3.5 h-3.5" />
          )}
          <span>Regenerate with AI</span>
        </button>
      </div>

      {/* Progress & Weak Topics Strip */}
      <div className="grid sm:grid-cols-12 gap-6 items-center p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="sm:col-span-4 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-800 dark:text-slate-200">7-Day Completion</span>
            <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
              {completedTasks} / {totalTasks} Tasks ({progressPercent}%)
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-indigo-600 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="sm:col-span-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs border-t sm:border-t-0 sm:border-l border-slate-100 dark:border-slate-800 sm:pl-6 pt-3 sm:pt-0">
          <div>
            <span className="font-semibold text-slate-700 dark:text-slate-300 block">
              Remediating Priority Weaknesses:
            </span>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {plan?.weakTopics.map((topic, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-0.5 rounded text-[11px] font-medium bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-900/40"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 7-Day Day-by-Day Accordion / Cards */}
      <div className="space-y-4">
        {plan?.days.map((day) => {
          const isExpanded = expandedDay === day.day;
          const dayCompleted = day.status === 'completed';
          const dayInProgress = day.status === 'in-progress';

          return (
            <div
              key={day.day}
              className={`rounded-xl border transition-all ${
                dayCompleted
                  ? 'border-emerald-200 dark:border-emerald-900/50 bg-white dark:bg-slate-900'
                  : dayInProgress
                  ? 'border-indigo-500 dark:border-indigo-500 bg-white dark:bg-slate-900 shadow-sm'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
              }`}
            >
              {/* Day Header Bar */}
              <button
                type="button"
                onClick={() => setExpandedDay(isExpanded ? 0 : day.day)}
                className="w-full flex items-center justify-between p-5 text-left transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs ${
                      dayCompleted
                        ? 'bg-emerald-500 text-white'
                        : dayInProgress
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    D{day.day}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                      Day {day.day}: {day.focus}
                    </h3>
                    <div className="text-[11px] text-slate-500">
                      {day.tasks.filter((t) => t.completed).length} of {day.tasks.length} tasks finished
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-[11px] font-medium uppercase tracking-wider ${
                      dayCompleted
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : dayInProgress
                        ? 'text-indigo-600 dark:text-indigo-400'
                        : 'text-slate-400'
                    }`}
                  >
                    {day.status}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              </button>

              {/* Tasks List */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-1 space-y-3 border-t border-slate-100 dark:border-slate-800/80">
                  {day.tasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => handleToggleTask(day.day, task.id)}
                      className={`p-3.5 rounded-lg border text-xs flex items-start gap-3 cursor-pointer transition-colors ${
                        task.completed
                          ? 'border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/30 dark:bg-emerald-950/10'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => {}}
                        className="mt-0.5 accent-indigo-600 w-4 h-4 cursor-pointer shrink-0"
                      />
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center justify-between">
                          <span
                            className={`font-semibold ${
                              task.completed
                                ? 'line-through text-slate-400 dark:text-slate-500'
                                : 'text-slate-900 dark:text-white'
                            }`}
                          >
                            {task.title}
                          </span>
                          <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono tabular-nums">
                            <Clock className="w-3 h-3" />
                            <span>{task.duration}</span>
                          </span>
                        </div>
                        <p
                          className={`text-[11px] leading-relaxed ${
                            task.completed
                              ? 'text-slate-400 dark:text-slate-500'
                              : 'text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          {task.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
