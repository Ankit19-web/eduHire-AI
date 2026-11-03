import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Briefcase,
  Layers,
  Clock,
  Code,
  FileText,
  Sliders,
  ChevronRight,
  Loader2,
} from 'lucide-react';

export const InterviewSetupPage: React.FC = () => {
  const navigate = useNavigate();

  const [jobRole, setJobRole] = useState('Senior Java Developer');
  const [customRole, setCustomRole] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('Mid-Level');
  const [interviewType, setInterviewType] = useState('technical');
  const [difficulty, setDifficulty] = useState('Medium');
  const [questionCount, setQuestionCount] = useState(4);
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [selectedTechs, setSelectedTechs] = useState<string[]>(['Java', 'Spring Boot', 'PostgreSQL', 'Redis']);
  const [customTech, setCustomTech] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resumes, setResumes] = useState<any[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string>('');

  const commonRoles = [
    'Senior Java Developer',
    'Full Stack Engineer',
    'Backend Systems Engineer',
    'DevOps & Cloud Architect',
    'Frontend React Specialist',
    'Data Engineer',
  ];

  const popularTechs = [
    'Java',
    'Spring Boot',
    'Kafka',
    'PostgreSQL',
    'Redis',
    'Docker',
    'Kubernetes',
    'React',
    'TypeScript',
    'AWS',
    'System Design',
    'Microservices',
  ];

  useEffect(() => {
    fetch('/api/resume')
      .then((res) => res.json())
      .then((data) => {
        if (data.resumes) setResumes(data.resumes);
      })
      .catch((err) => console.warn('Could not load resumes:', err));
  }, []);

  const toggleTech = (tech: string) => {
    if (selectedTechs.includes(tech)) {
      setSelectedTechs(selectedTechs.filter((t) => t !== tech));
    } else {
      setSelectedTechs([...selectedTechs, tech]);
    }
  };

  const addCustomTech = (e: React.FormEvent) => {
    e.preventDefault();
    if (customTech.trim() && !selectedTechs.includes(customTech.trim())) {
      setSelectedTechs([...selectedTechs, customTech.trim()]);
      setCustomTech('');
    }
  };

  const handleStartInterview = async () => {
    setIsSubmitting(true);
    const finalRole = customRole.trim() || jobRole;

    try {
      const token = localStorage.getItem('eduhire_token');
      const res = await fetch('/api/interviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({
          jobRole: finalRole,
          experienceLevel,
          interviewType,
          difficulty,
          technologies: selectedTechs,
          questionCount,
          durationMinutes,
          resumeContext: selectedResumeId ? `Grounded in resume: ${selectedResumeId}` : undefined,
        }),
      });

      const data = await res.json();
      if (res.ok && data.interview) {
        navigate(`/interview/${data.interview.id}`);
      } else {
        alert(data.error || 'Failed to initialize AI interview.');
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error('Error starting interview:', err);
      alert('Network error initializing interview.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
          Simulation Studio
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Configure Your Mock Interview
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          The AI will synthesize customized questions, evaluate your responses on 6 parameters, and challenge you with adaptive follow-ups.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-8 shadow-sm">
        {/* 1. Target Job Role */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
            <Briefcase className="w-4 h-4 text-indigo-500" />
            <span>1. Target Job Role</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {commonRoles.map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => {
                  setJobRole(role);
                  setCustomRole('');
                }}
                className={`p-3 text-xs text-left rounded-lg border transition-colors ${
                  jobRole === role && !customRole
                    ? 'border-indigo-600 dark:border-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-900 dark:text-indigo-200 font-semibold'
                    : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Or specify custom role (e.g. Distributed Consensus SRE)..."
            value={customRole}
            onChange={(e) => setCustomRole(e.target.value)}
            className="w-full text-xs p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* 2. Experience Level & Difficulty */}
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
              <Layers className="w-4 h-4 text-indigo-500" />
              <span>2. Experience Level</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['Entry', 'Mid-Level', 'Senior', 'Lead'].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setExperienceLevel(level)}
                  className={`p-2.5 text-xs rounded-lg border text-center transition-colors ${
                    experienceLevel === level
                      ? 'border-indigo-600 dark:border-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-900 dark:text-indigo-200 font-semibold'
                      : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
              <Sliders className="w-4 h-4 text-indigo-500" />
              <span>3. Difficulty</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['Easy', 'Medium', 'Hard'].map((diff) => (
                <button
                  key={diff}
                  type="button"
                  onClick={() => setDifficulty(diff)}
                  className={`p-2.5 text-xs rounded-lg border text-center transition-colors ${
                    difficulty === diff
                      ? 'border-indigo-600 dark:border-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-900 dark:text-indigo-200 font-semibold'
                      : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Interview Format */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-900 dark:text-white">
            4. Interview Track
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {[
              { id: 'technical', label: 'Technical' },
              { id: 'hr', label: 'HR Screening' },
              { id: 'behavioral', label: 'Behavioral STAR' },
              { id: 'coding', label: 'Coding / DSA' },
              { id: 'resume', label: 'Resume-Grounded' },
            ].map((track) => (
              <button
                key={track.id}
                type="button"
                onClick={() => setInterviewType(track.id)}
                className={`p-3 text-xs rounded-lg border text-center transition-colors ${
                  interviewType === track.id
                    ? 'border-indigo-600 dark:border-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-900 dark:text-indigo-200 font-semibold'
                    : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                {track.label}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Technologies Selection */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
            <Code className="w-4 h-4 text-indigo-500" />
            <span>5. Target Technologies & Topics</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {popularTechs.map((tech) => {
              const isSelected = selectedTechs.includes(tech);
              return (
                <button
                  key={tech}
                  type="button"
                  onClick={() => toggleTech(tech)}
                  className={`px-3 py-1.5 text-xs rounded-md border transition-colors ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-600 font-medium'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  {tech}
                </button>
              );
            })}
          </div>

          <form onSubmit={addCustomTech} className="flex gap-2 pt-2">
            <input
              type="text"
              placeholder="Add another technology or topic (e.g. gRPC)..."
              value={customTech}
              onChange={(e) => setCustomTech(e.target.value)}
              className="flex-1 text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="px-3.5 py-2 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
            >
              Add
            </button>
          </form>
        </div>

        {/* 5. Resume Binding (Optional) */}
        {resumes.length > 0 && (
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
              <FileText className="w-4 h-4 text-indigo-500" />
              <span>6. Ground in Uploaded Resume (Optional)</span>
            </label>
            <select
              value={selectedResumeId}
              onChange={(e) => setSelectedResumeId(e.target.value)}
              className="w-full text-xs p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">None (Use standard role parameters)</option>
              {resumes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.fileName} — {r.headline}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* 6. Question Count & Duration */}
        <div className="grid sm:grid-cols-2 gap-6 pt-2">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Questions: {questionCount}
            </label>
            <input
              type="range"
              min="2"
              max="8"
              value={questionCount}
              onChange={(e) => setQuestionCount(Number(e.target.value))}
              className="w-full accent-indigo-600"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Target Duration: {durationMinutes} minutes
            </label>
            <input
              type="range"
              min="15"
              max="60"
              step="15"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
              className="w-full accent-indigo-600"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleStartInterview}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-colors disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generating Adaptive Questions...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Begin Live Interview Room</span>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
