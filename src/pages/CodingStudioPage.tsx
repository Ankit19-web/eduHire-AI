import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import {
  Play,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  XCircle,
  Clock,
  Cpu,
  Layers,
  ChevronDown,
  Terminal,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext.tsx';
import { CODING_PROBLEMS, CodingProblem } from '../server/codingProblems.ts';

export const CodingStudioPage: React.FC = () => {
  const { theme } = useTheme();

  const [problems, setProblems] = useState<CodingProblem[]>(CODING_PROBLEMS);
  const [selectedProblem, setSelectedProblem] = useState<CodingProblem>(CODING_PROBLEMS[0]);
  const [code, setCode] = useState<string>(CODING_PROBLEMS[0].starterCodeJava);
  const [isRunning, setIsRunning] = useState(false);
  const [runResult, setRunResult] = useState<any>(null);
  const [isReviewing, setIsReviewing] = useState(false);
  const [aiReview, setAiReview] = useState<string | null>(null);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'console' | 'review'>('console');

  // Change problem handler
  const handleSelectProblem = (problem: CodingProblem) => {
    setSelectedProblem(problem);
    setCode(problem.starterCodeJava);
    setRunResult(null);
    setAiReview(null);
    setCurrentHintIndex(0);
  };

  // Run code against test cases
  const handleRunCode = async () => {
    setIsRunning(true);
    setActiveTab('console');

    try {
      const res = await fetch('/api/code/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemId: selectedProblem.id,
          code,
          language: 'java',
        }),
      });

      const data = await res.json();
      setRunResult(data);
    } catch (err) {
      console.error('Execution error:', err);
      setRunResult({
        success: false,
        status: 'Runtime Error',
        error: 'Failed to communicate with code evaluation service.',
        testResults: [],
      });
    } finally {
      setIsRunning(false);
    }
  };

  // Request AI Code Review from Gemini
  const handleRequestReview = async () => {
    setIsReviewing(true);
    setActiveTab('review');

    try {
      const token = localStorage.getItem('eduhire_token');
      const res = await fetch('/api/ai/code-review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({
          problemTitle: selectedProblem.title,
          code,
          language: 'java',
        }),
      });

      const data = await res.json();
      setAiReview(data.review || 'No review returned.');
    } catch (err) {
      console.error('Review error:', err);
      setAiReview('Unable to generate AI review at this time.');
    } finally {
      setIsReviewing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Problem Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                {selectedProblem.title}
              </span>
              <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                · {selectedProblem.difficulty}
              </span>
              <span className="text-xs text-slate-500">
                · {selectedProblem.category}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
              <span>Target Time: {selectedProblem.timeComplexityOptimal}</span>
              <span aria-hidden="true">·</span>
              <span>Target Space: {selectedProblem.spaceComplexityOptimal}</span>
            </div>
          </div>
        </div>

        {/* Problem Selector Dropdown */}
        <div className="flex items-center gap-3">
          <select
            value={selectedProblem.id}
            onChange={(e) => {
              const found = problems.find((p) => p.id === e.target.value);
              if (found) handleSelectProblem(found);
            }}
            className="text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            {problems.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} ({p.difficulty})
              </option>
            ))}
          </select>

          <button
            onClick={() => setCode(selectedProblem.starterCodeJava)}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
            title="Reset Starter Code"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Editor & Problem Split Layout */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Problem Description & Test Cases */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm max-h-[750px] overflow-y-auto">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              Problem Description
            </h2>

            <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
              {selectedProblem.description}
            </div>

            {/* Constraints */}
            <div className="space-y-1.5 pt-3 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs font-semibold text-slate-900 dark:text-white">
                Constraints:
              </span>
              <ul className="list-disc pl-4 space-y-1 text-xs text-slate-600 dark:text-slate-400 font-mono">
                {selectedProblem.constraints.map((c, idx) => (
                  <li key={idx}>{c}</li>
                ))}
              </ul>
            </div>

            {/* Public Test Cases */}
            <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs font-semibold text-slate-900 dark:text-white">
                Example Test Cases:
              </span>
              <div className="space-y-2">
                {selectedProblem.testCases.filter((tc) => tc.isPublic).map((tc, idx) => (
                  <div key={tc.id} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1 font-mono text-[11px]">
                    <div className="text-slate-500">Example {idx + 1}:</div>
                    <div><span className="text-slate-500">Input:</span> {tc.input}</div>
                    <div><span className="text-indigo-600 dark:text-indigo-400">Output:</span> {tc.expectedOutput}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Progressive AI Hints */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-indigo-500" />
                  <span>AI Hints ({Math.min(currentHintIndex + 1, selectedProblem.hints.length)} of {selectedProblem.hints.length})</span>
                </span>
                {currentHintIndex < selectedProblem.hints.length - 1 && (
                  <button
                    onClick={() => setCurrentHintIndex((prev) => prev + 1)}
                    className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    Next Hint
                  </button>
                )}
              </div>
              <div className="p-3 rounded-lg bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 text-xs text-slate-700 dark:text-slate-300">
                {selectedProblem.hints[currentHintIndex]}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Monaco Editor & Output Console */}
        <div className="lg:col-span-7 space-y-4">
          {/* Monaco Code Editor Container */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm bg-white dark:bg-slate-950">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-600 dark:text-slate-300">
                <span>Solution.java</span>
                <span className="text-slate-400">·</span>
                <span className="text-indigo-600 dark:text-indigo-400">Java 21</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={isRunning}
                  onClick={handleRunCode}
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
                >
                  {isRunning ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                  <span>Run Test Cases</span>
                </button>

                <button
                  type="button"
                  disabled={isReviewing}
                  onClick={handleRequestReview}
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
                >
                  {isReviewing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  <span>AI Code Review</span>
                </button>
              </div>
            </div>

            <div className="h-[420px]">
              <Editor
                height="100%"
                language="java"
                theme={theme === 'dark' ? 'vs-dark' : 'light'}
                value={code}
                onChange={(val) => setCode(val || '')}
                options={{
                  fontSize: 13,
                  fontFamily: "'JetBrains Mono', monospace",
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 4,
                }}
              />
            </div>
          </div>

          {/* Bottom Tabs: Test Console & AI Review */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
            <div className="flex items-center border-b border-slate-200 dark:border-slate-800 px-4 bg-slate-50 dark:bg-slate-900">
              <button
                onClick={() => setActiveTab('console')}
                className={`py-2.5 px-3 text-xs font-medium border-b-2 transition-colors ${
                  activeTab === 'console'
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-semibold'
                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Test Case Console
              </button>
              <button
                onClick={() => setActiveTab('review')}
                className={`py-2.5 px-3 text-xs font-medium border-b-2 transition-colors ${
                  activeTab === 'review'
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-semibold'
                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                AI Review & Complexity
              </button>
            </div>

            <div className="p-4 min-h-[160px]">
              {activeTab === 'console' ? (
                runResult ? (
                  <div className="space-y-3 font-mono text-xs">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        {runResult.allPassed ? (
                          <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Accepted</span>
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 text-red-500 font-bold">
                            <XCircle className="w-4 h-4" />
                            <span>Wrong Answer / Incomplete</span>
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-slate-500 text-[11px] tabular-nums">
                        <span>Runtime: {runResult.runtimeMs}ms</span>
                        <span>Memory: {runResult.memoryMb}MB</span>
                      </div>
                    </div>

                    {runResult.error && (
                      <div className="p-3 rounded bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900">
                        {runResult.error}
                      </div>
                    )}

                    <div className="space-y-1.5">
                      {runResult.testResults?.map((tr: any) => (
                        <div
                          key={tr.id}
                          className="flex items-center justify-between p-2 rounded bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800"
                        >
                          <div className="flex items-center gap-2">
                            {tr.passed ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            ) : (
                              <XCircle className="w-3.5 h-3.5 text-red-500" />
                            )}
                            <span>Case {tr.testNumber}:</span>
                            <span className="text-slate-500 truncate max-w-xs">{tr.input}</span>
                          </div>
                          <span className="text-slate-400 text-[11px] tabular-nums">
                            {tr.runtimeMs}ms
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-6 text-slate-400 text-xs gap-1.5">
                    <Terminal className="w-5 h-5 opacity-40" />
                    <p>Click "Run Test Cases" to execute and inspect outputs.</p>
                  </div>
                )
              ) : (
                aiReview ? (
                  <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 space-y-2 whitespace-pre-line leading-relaxed">
                    {aiReview}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-6 text-slate-400 text-xs gap-1.5">
                    <Sparkles className="w-5 h-5 opacity-40" />
                    <p>Click "AI Code Review" for Big-O analysis, edge cases, and optimization insights.</p>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
