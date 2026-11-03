import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Upload,
  Sparkles,
  CheckCircle2,
  Briefcase,
  Layers,
  Code,
  ArrowRight,
  Loader2,
  FileCheck,
} from 'lucide-react';

export const ResumeAnalyzerPage: React.FC = () => {
  const navigate = useNavigate();

  const [resumes, setResumes] = useState<any[]>([]);
  const [selectedResume, setSelectedResume] = useState<any>(null);
  const [resumeText, setResumeText] = useState('');
  const [fileName, setFileName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isStartingInterview, setIsStartingInterview] = useState(false);

  // Sample quick-fill template for instant testing
  const sampleTemplate = `ALEX RIVERA
Senior Full Stack Engineer | alex.dev@eduhire.ai

PROFESSIONAL SUMMARY
Senior Engineer with 5+ years building event-driven microservices in Java, Spring Boot, Apache Kafka, and React. Architected high-throughput transaction ledger handling 12,000 tx/sec with 99.99% uptime.

CORE SKILLS
Java 21, Spring Boot 3, Apache Kafka, Redis, PostgreSQL, Docker, Kubernetes, AWS (ECS, S3, RDS), TypeScript, React, System Design, Concurrency.

WORK EXPERIENCE
Senior Software Engineer — CloudScale FinTech (2023 - Present)
- Architected high-throughput payment settlement engine handling 12k tx/sec using Spring Cloud Stream and Kafka.
- Reduced Redis query latency by 45% through key sharding and pipeline caching.
- Designed distributed saga pattern for multi-step bank reconciliation.

Software Engineer — Nexis Systems (2021 - 2023)
- Engineered scalable REST APIs in Spring Boot backed by PostgreSQL with connection pooling.
- Authored automated load test suites with Gatling simulating 50k concurrent users.

FEATURED PROJECTS
- Event-Driven Order Processing Pipeline: Built using Java, Spring Cloud Stream, Kafka, and PostgreSQL. Decoupled payment authorization from inventory reservation.
- Distributed Rate Limiter Service: Implemented sliding window log and token bucket algorithms capable of evaluating 50k requests/sec.`;

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = () => {
    fetch('/api/resume')
      .then((res) => res.json())
      .then((data) => {
        if (data.resumes && data.resumes.length > 0) {
          setResumes(data.resumes);
          setSelectedResume(data.resumes[0]);
        }
      })
      .catch((err) => console.error('Failed to load resumes:', err));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setResumeText(text || sampleTemplate);
    };
    reader.readAsText(file);
  };

  const handleAnalyzeResume = async () => {
    if (!resumeText.trim()) return;
    setIsProcessing(true);

    try {
      const token = localStorage.getItem('eduhire_token');
      const res = await fetch('/api/resume/parse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({
          resumeText,
          fileName: fileName || 'Candidate_Resume.txt',
        }),
      });

      const data = await res.json();
      if (res.ok && data.resume) {
        setResumes([data.resume, ...resumes]);
        setSelectedResume(data.resume);
      } else {
        alert(data.error || 'Failed to process resume.');
      }
    } catch (err) {
      console.error('Resume analysis error:', err);
      alert('Error parsing resume.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Launch a tailored interview session grounded on this resume
  const handleLaunchResumeInterview = async () => {
    if (!selectedResume) return;
    setIsStartingInterview(true);

    try {
      const token = localStorage.getItem('eduhire_token');
      const res = await fetch('/api/interviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({
          jobRole: selectedResume.headline || 'Software Engineer',
          experienceLevel: 'Senior',
          interviewType: 'resume',
          difficulty: 'Hard',
          technologies: selectedResume.skills.slice(0, 5),
          questionCount: 4,
          durationMinutes: 30,
          resumeContext: `Candidate Name: ${selectedResume.candidateName}\nKey Skills: ${selectedResume.skills.join(', ')}\nProjects: ${JSON.stringify(selectedResume.projects)}`,
        }),
      });

      const data = await res.json();
      if (res.ok && data.interview) {
        navigate(`/interview/${data.interview.id}`);
      }
    } catch (err) {
      console.error('Failed to start resume interview:', err);
    } finally {
      setIsStartingInterview(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
          Profile Intelligence
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          AI Resume Analyzer & Project Grounding
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Upload your resume to extract claimed frameworks, past architecture projects, and generate customized, high-stakes interview questions based on what you actually built.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Upload & Text Box */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Upload className="w-4 h-4 text-indigo-500" />
              <span>Upload or Paste Resume</span>
            </h2>

            {/* File Upload Dropzone */}
            <label className="border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-400 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-slate-50/50 dark:bg-slate-950/50">
              <FileCheck className="w-8 h-8 text-indigo-500 mb-2" />
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                {fileName ? fileName : 'Choose resume file (PDF, TXT)'}
              </span>
              <span className="text-[11px] text-slate-400 mt-1">
                Drag and drop or click to browse
              </span>
              <input
                type="file"
                accept=".txt,.pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            {/* Paste or edit raw text */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-700 dark:text-slate-300">Resume Content</span>
                <button
                  type="button"
                  onClick={() => {
                    setResumeText(sampleTemplate);
                    setFileName('Alex_Rivera_Senior_Resume.txt');
                  }}
                  className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Load Sample Profile
                </button>
              </div>

              <textarea
                rows={9}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste plain text resume contents here..."
                className="w-full text-xs p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono leading-relaxed"
              />
            </div>

            <button
              type="button"
              disabled={!resumeText.trim() || isProcessing}
              onClick={handleAnalyzeResume}
              className="w-full py-2.5 px-4 text-xs font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Extracting Skills, Experience & Projects...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Analyze Resume with AI</span>
                </>
              )}
            </button>
          </div>

          {/* Previous Parsed Resumes */}
          {resumes.length > 0 && (
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Analyzed Profiles ({resumes.length})
              </span>
              <div className="space-y-1">
                {resumes.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setSelectedResume(r)}
                    className={`w-full text-left p-2.5 rounded-lg border text-xs transition-colors ${
                      selectedResume?.id === r.id
                        ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-900 dark:text-indigo-200 font-medium'
                        : 'border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <div className="font-semibold">{r.fileName}</div>
                    <div className="text-[11px] text-slate-500 truncate">{r.headline}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Extracted Entities & Tailored Questions */}
        <div className="lg:col-span-7 space-y-6">
          {selectedResume ? (
            <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm">
              {/* Profile summary header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {selectedResume.candidateName}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {selectedResume.headline}
                  </p>
                </div>

                <button
                  type="button"
                  disabled={isStartingInterview}
                  onClick={handleLaunchResumeInterview}
                  className="px-4 py-2 text-xs font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-colors disabled:opacity-50 flex items-center gap-1.5 whitespace-nowrap"
                >
                  {isStartingInterview ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5" />
                  )}
                  <span>Launch Resume-Based Mock</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Extracted Skills */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <Code className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Identified Technical Stack ({selectedResume.skills?.length || 0})</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedResume.skills?.map((skill: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 text-xs rounded-md bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Extracted Experience */}
              {selectedResume.experience?.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Experience History</span>
                  </span>
                  <div className="space-y-2">
                    {selectedResume.experience.map((exp: any, idx: number) => (
                      <div key={idx} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-xs space-y-1">
                        <div className="flex items-center justify-between font-semibold text-slate-900 dark:text-white">
                          <span>{exp.role} · {exp.company}</span>
                          <span className="text-slate-400 font-normal">{exp.duration}</span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                          {exp.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Extracted Projects */}
              {selectedResume.projects?.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Featured Projects</span>
                  </span>
                  <div className="space-y-2">
                    {selectedResume.projects.map((proj: any, idx: number) => (
                      <div key={idx} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-xs space-y-1">
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {proj.title}
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                          {proj.description}
                        </p>
                        {proj.tech && proj.tech.length > 0 && (
                          <div className="text-[10px] text-slate-400">
                            Stack: {proj.tech.join(', ')}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Tailored Interview Questions */}
              {selectedResume.suggestedQuestions?.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Targeted Questions on Claimed Projects</span>
                  </span>
                  <div className="space-y-2">
                    {selectedResume.suggestedQuestions.map((q: string, idx: number) => (
                      <div key={idx} className="p-3 rounded-lg bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 text-xs text-slate-800 dark:text-slate-200 space-y-1">
                        <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">Q{idx + 1}.</span> {q}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3">
              <FileText className="w-8 h-8 text-slate-400 mx-auto" />
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                No Resume Selected
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Paste or upload a resume on the left to extract tech skills, past project accomplishments, and tailored interview questions.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
