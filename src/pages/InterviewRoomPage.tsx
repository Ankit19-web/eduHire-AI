import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Send,
  Sparkles,
  Clock,
  ChevronRight,
  CheckCircle,
  HelpCircle,
  Bot,
  User,
  Zap,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { InterviewSession, AnswerEvaluation } from '../types/index.ts';

export const InterviewRoomPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [session, setSession] = useState<InterviewSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answerText, setAnswerText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [currentEvaluation, setCurrentEvaluation] = useState<AnswerEvaluation | null>(null);
  const [followUpQuestion, setFollowUpQuestion] = useState<string | null>(null);
  const [followUpAnswer, setFollowUpAnswer] = useState('');
  const [isSubmittingFollowUp, setIsSubmittingFollowUp] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);

  // Timer
  const [secondsRemaining, setSecondsRemaining] = useState(1800); // 30 mins default

  // Speech Recognition reference
  const recognitionRef = useRef<any>(null);

  // Load session
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
          setCurrentIndex(data.interview.currentQuestionIndex || 0);
          setSecondsRemaining((data.interview.durationMinutes || 30) * 60);

          // If current question already has an answer, restore it
          const existingAnswer = data.interview.answers?.[data.interview.currentQuestionIndex || 0];
          if (existingAnswer) {
            setAnswerText(existingAnswer.answerText);
            setCurrentEvaluation(existingAnswer.evaluation || null);
          }
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching interview:', err);
        setLoading(false);
      });
  }, [id]);

  // Setup Web Speech API for voice interviews
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setAnswerText((prev) => (prev ? `${prev} ${transcript}` : transcript));
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    } else {
      setSpeechSupported(false);
    }
  }, []);

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Text-to-Speech question reading
  const speakText = (text: string) => {
    if (!ttsEnabled || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const currentQuestion = session?.questions?.[currentIndex];

  // Auto-speak on question change
  useEffect(() => {
    if (currentQuestion && ttsEnabled) {
      speakText(currentQuestion.question);
    }
  }, [currentIndex, session]);

  const toggleRecording = () => {
    if (!recognitionRef.current) return;
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.error('Failed to start speech recognition:', err);
        setIsRecording(false);
      }
    }
  };

  // Submit candidate answer for 6-parameter evaluation & adaptive follow-up
  const handleSubmitAnswer = async () => {
    if (!answerText.trim() || !session || !currentQuestion) return;
    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }

    setIsEvaluating(true);
    try {
      const token = localStorage.getItem('eduhire_token');
      const res = await fetch('/api/ai/evaluate-answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({
          question: currentQuestion.question,
          expectedKeyPoints: currentQuestion.expectedKeyPoints,
          answerText,
          jobRole: session.jobRole,
          experienceLevel: session.experienceLevel,
        }),
      });

      const data = await res.json();
      if (data.evaluation) {
        setCurrentEvaluation(data.evaluation);
        setFollowUpQuestion(data.evaluation.followUpQuestion || null);

        // Save answer to session
        const updatedAnswers = [...(session.answers || [])];
        const existingIdx = updatedAnswers.findIndex(
          (a) => a.questionId === currentQuestion.id
        );

        const newRecord = {
          questionId: currentQuestion.id,
          question: currentQuestion.question,
          answerText,
          evaluation: data.evaluation,
          answeredAt: new Date().toISOString(),
        };

        if (existingIdx !== -1) {
          updatedAnswers[existingIdx] = newRecord;
        } else {
          updatedAnswers.push(newRecord);
        }

        // Persist update
        await fetch(`/api/interviews/${session.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token ? `Bearer ${token}` : '',
          },
          body: JSON.stringify({
            answers: updatedAnswers,
            currentQuestionIndex: currentIndex,
          }),
        });

        setSession({ ...session, answers: updatedAnswers });

        // Speak follow-up if present
        if (data.evaluation.followUpQuestion && ttsEnabled) {
          speakText(`Good points. Now consider this follow-up: ${data.evaluation.followUpQuestion}`);
        }
      }
    } catch (err) {
      console.error('Answer evaluation error:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  // Submit follow-up response
  const handleFollowUpSubmit = async () => {
    if (!followUpAnswer.trim() || !session || !currentQuestion) return;
    setIsSubmittingFollowUp(true);

    const token = localStorage.getItem('eduhire_token');
    // Append follow-up to answer text
    const combinedAnswer = `${answerText}\n\n[Candidate Follow-Up Response to: "${followUpQuestion}"]: ${followUpAnswer}`;
    setAnswerText(combinedAnswer);

    // Re-evaluate with augmented answer
    try {
      const res = await fetch('/api/ai/evaluate-answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({
          question: currentQuestion.question,
          expectedKeyPoints: currentQuestion.expectedKeyPoints,
          answerText: combinedAnswer,
          jobRole: session.jobRole,
          experienceLevel: session.experienceLevel,
        }),
      });

      const data = await res.json();
      if (data.evaluation) {
        setCurrentEvaluation(data.evaluation);
        setFollowUpQuestion(null);
        setFollowUpAnswer('');

        const updatedAnswers = [...(session.answers || [])];
        const existingIdx = updatedAnswers.findIndex(
          (a) => a.questionId === currentQuestion.id
        );
        if (existingIdx !== -1) {
          updatedAnswers[existingIdx].answerText = combinedAnswer;
          updatedAnswers[existingIdx].evaluation = data.evaluation;
        }

        await fetch(`/api/interviews/${session.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token ? `Bearer ${token}` : '',
          },
          body: JSON.stringify({ answers: updatedAnswers }),
        });

        setSession({ ...session, answers: updatedAnswers });
      }
    } catch (err) {
      console.error('Follow-up submit error:', err);
    } finally {
      setIsSubmittingFollowUp(false);
    }
  };

  // Move to next question or complete
  const handleNextQuestion = () => {
    if (!session) return;
    if (currentIndex < session.questions.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      const nextExistingAnswer = session.answers?.[nextIdx];
      setAnswerText(nextExistingAnswer ? nextExistingAnswer.answerText : '');
      setCurrentEvaluation(nextExistingAnswer?.evaluation || null);
      setFollowUpQuestion(null);
      setFollowUpAnswer('');
    } else {
      handleCompleteInterview();
    }
  };

  const handleCompleteInterview = async () => {
    if (!session) return;
    setIsFinishing(true);

    try {
      const token = localStorage.getItem('eduhire_token');
      const res = await fetch(`/api/interviews/${session.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({
          status: 'completed',
          answers: session.answers,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });

        setTimeout(() => {
          navigate(`/report/${session.id}`);
        }, 1200);
      }
    } catch (err) {
      console.error('Complete interview error:', err);
      setIsFinishing(false);
    }
  };

  if (loading || !session) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 flex flex-col items-center justify-center gap-3 text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        <p className="text-sm">Connecting to AI Interview Room...</p>
      </div>
    );
  }

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Session Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center text-white">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-slate-900 dark:text-white">
              {session.title}
            </h1>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>{session.jobRole}</span>
              <span aria-hidden="true">·</span>
              <span>{session.experienceLevel}</span>
              <span aria-hidden="true">·</span>
              <span>{session.difficulty}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Audio TTS toggle */}
          <button
            onClick={() => {
              if (ttsEnabled && window.speechSynthesis) window.speechSynthesis.cancel();
              setTtsEnabled(!ttsEnabled);
            }}
            className={`p-2 rounded-lg border text-xs flex items-center gap-1.5 transition-colors ${
              ttsEnabled
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30'
                : 'border-slate-200 dark:border-slate-800 text-slate-500'
            }`}
            title="Toggle AI Voice Reading"
          >
            {ttsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">{ttsEnabled ? 'AI Voice ON' : 'AI Voice Muted'}</span>
          </button>

          {/* Time Remaining */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-mono font-medium tabular-nums">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>{formatTime(secondsRemaining)}</span>
          </div>

          {/* Stepper Count */}
          <div className="text-xs text-slate-600 dark:text-slate-400 font-medium">
            Question <span className="text-indigo-600 dark:text-indigo-400 font-bold">{currentIndex + 1}</span> of {session.questions.length}
          </div>
        </div>
      </div>

      {/* Main Question & Interaction Panel */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: AI Question & Transcript */}
        <div className="lg:col-span-7 space-y-6">
          {/* Question Card */}
          <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                Topic: {currentQuestion?.topic || 'Architecture & Design'}
              </span>
              <button
                onClick={() => currentQuestion && speakText(currentQuestion.question)}
                className="text-xs text-slate-500 hover:text-indigo-600 flex items-center gap-1"
                title="Replay Question Audio"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Replay</span>
              </button>
            </div>

            <p className="text-base sm:text-lg font-medium text-slate-900 dark:text-white leading-relaxed">
              "{currentQuestion?.question}"
            </p>

            {currentQuestion?.expectedKeyPoints && currentQuestion.expectedKeyPoints.length > 0 && (
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 space-y-1">
                <span className="font-medium text-slate-700 dark:text-slate-300">Target Discussion Dimensions:</span>
                <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                  {currentQuestion.expectedKeyPoints.map((kp, idx) => (
                    <li key={idx}>{kp}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Candidate Answer Box */}
          <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-indigo-500" />
                <span>Your Verbal / Written Explanation</span>
              </label>

              {speechSupported && (
                <button
                  type="button"
                  onClick={toggleRecording}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all ${
                    isRecording
                      ? 'bg-red-500 text-white animate-pulse'
                      : 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/60'
                  }`}
                >
                  {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                  <span>{isRecording ? 'Listening (Click to Stop)' : 'Speak Answer'}</span>
                </button>
              )}
            </div>

            <textarea
              rows={6}
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              placeholder="Structure your answer clearly. State the core mechanics, concrete trade-offs, and failure handling..."
              className="w-full text-xs sm:text-sm p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 leading-relaxed"
            />

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <span className="text-[11px] text-slate-400">
                {answerText.trim() ? `${answerText.trim().split(/\s+/).length} words` : '0 words'}
              </span>

              <button
                type="button"
                disabled={!answerText.trim() || isEvaluating}
                onClick={handleSubmitAnswer}
                className="px-5 py-2.5 text-xs font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isEvaluating ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Evaluating across 6 parameters...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Submit & Evaluate Answer</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Adaptive Follow-Up Question Prompt (If triggered) */}
          {followUpQuestion && (
            <div className="p-6 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 space-y-4">
              <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 text-xs font-semibold">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Interviewer Probing Follow-Up</span>
              </div>
              <p className="text-sm font-medium text-amber-950 dark:text-amber-100 leading-relaxed">
                "{followUpQuestion}"
              </p>
              <textarea
                rows={3}
                value={followUpAnswer}
                onChange={(e) => setFollowUpAnswer(e.target.value)}
                placeholder="Clarify your stance or explain the edge case..."
                className="w-full text-xs p-3 rounded-lg border border-amber-200 dark:border-amber-800/80 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  disabled={!followUpAnswer.trim() || isSubmittingFollowUp}
                  onClick={handleFollowUpSubmit}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-amber-600 hover:bg-amber-700 text-white transition-colors disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isSubmittingFollowUp ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Synthesizing...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Follow-up Response</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Real-time Evaluation Card & Navigation */}
        <div className="lg:col-span-5 space-y-6">
          {currentEvaluation ? (
            <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  AI Evaluation
                </span>
                <div className="flex items-baseline gap-1 font-mono font-bold text-lg text-indigo-600 dark:text-indigo-400 tabular-nums">
                  {currentEvaluation.score}<span className="text-xs font-normal text-slate-400">/100</span>
                </div>
              </div>

              {/* 6 Dimension Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <div className="text-[10px] text-slate-500">1. Tech Accuracy</div>
                  <div className="font-mono font-bold tabular-nums text-slate-800 dark:text-slate-200">
                    {currentEvaluation.technicalAccuracy}%
                  </div>
                </div>

                <div className="p-2 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <div className="text-[10px] text-slate-500">2. Understanding</div>
                  <div className="font-mono font-bold tabular-nums text-slate-800 dark:text-slate-200">
                    {currentEvaluation.conceptualUnderstanding}%
                  </div>
                </div>

                <div className="p-2 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <div className="text-[10px] text-slate-500">3. Problem Solving</div>
                  <div className="font-mono font-bold tabular-nums text-slate-800 dark:text-slate-200">
                    {currentEvaluation.problemSolving}%
                  </div>
                </div>

                <div className="p-2 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <div className="text-[10px] text-slate-500">4. Completeness</div>
                  <div className="font-mono font-bold tabular-nums text-slate-800 dark:text-slate-200">
                    {currentEvaluation.completeness}%
                  </div>
                </div>

                <div className="p-2 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <div className="text-[10px] text-slate-500">5. Communication</div>
                  <div className="font-mono font-bold tabular-nums text-slate-800 dark:text-slate-200">
                    {currentEvaluation.communicationClarity}%
                  </div>
                </div>

                <div className="p-2 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <div className="text-[10px] text-slate-500">6. Relevance</div>
                  <div className="font-mono font-bold tabular-nums text-slate-800 dark:text-slate-200">
                    {currentEvaluation.relevance}%
                  </div>
                </div>
              </div>

              {/* Strengths */}
              {currentEvaluation.strengths?.length > 0 && (
                <div className="space-y-1.5 text-xs">
                  <div className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>What You Did Well:</span>
                  </div>
                  <ul className="space-y-1 text-slate-600 dark:text-slate-400 pl-4 list-disc text-[11px]">
                    {currentEvaluation.strengths.map((str, idx) => (
                      <li key={idx}>{str}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Improvements */}
              {currentEvaluation.improvements?.length > 0 && (
                <div className="space-y-1.5 text-xs">
                  <div className="font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Recommended Enhancements:</span>
                  </div>
                  <ul className="space-y-1 text-slate-600 dark:text-slate-400 pl-4 list-disc text-[11px]">
                    {currentEvaluation.improvements.map((imp, idx) => (
                      <li key={idx}>{imp}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Ideal Answer Sample */}
              {currentEvaluation.idealAnswer && (
                <div className="p-3 rounded-lg bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 text-xs space-y-1">
                  <span className="font-semibold text-indigo-700 dark:text-indigo-300">
                    Benchmark Ideal Answer:
                  </span>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                    {currentEvaluation.idealAnswer}
                  </p>
                </div>
              )}

              {/* Next Question / Finish Action */}
              <div className="pt-2">
                <button
                  type="button"
                  disabled={isFinishing}
                  onClick={handleNextQuestion}
                  className="w-full py-2.5 px-4 text-xs font-semibold rounded-lg text-white bg-slate-900 dark:bg-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors flex items-center justify-center gap-2"
                >
                  {isFinishing ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Compiling Diagnostic Report...</span>
                    </>
                  ) : currentIndex < session.questions.length - 1 ? (
                    <>
                      <span>Next Question</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Complete Interview & View Report</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm text-center py-12">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
                <HelpCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Awaiting Answer
                </h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Type or speak your answer on the left. The AI evaluator will score all 6 parameters and generate adaptive follow-up challenges.
                </p>
              </div>
            </div>
          )}

          {/* Question Index Navigator */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Question Navigator
            </span>
            <div className="grid grid-cols-4 gap-2">
              {session.questions.map((q, idx) => {
                const isAnswered = session.answers?.some((a) => a.questionId === q.id);
                const isCurrent = idx === currentIndex;
                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      setCurrentIndex(idx);
                      const ans = session.answers?.find((a) => a.questionId === q.id);
                      setAnswerText(ans ? ans.answerText : '');
                      setCurrentEvaluation(ans?.evaluation || null);
                      setFollowUpQuestion(null);
                    }}
                    className={`py-2 text-xs font-mono rounded-lg border text-center transition-colors ${
                      isCurrent
                        ? 'border-indigo-600 bg-indigo-600 text-white font-bold'
                        : isAnswered
                        ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Q{idx + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
