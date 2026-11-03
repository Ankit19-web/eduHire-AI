import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Cpu,
  Mic,
  Terminal,
  FileCheck2,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Code2,
  ChevronDown,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const [openFaq, setOpenFaq] = React.useState<number | null>(0);

  const faqs = [
    {
      q: 'How does the adaptive follow-up system differ from typical mock interview platforms?',
      a: 'Most tools serve a static list of questions. EduHire-AI evaluates your spoken or typed answer in real-time using Gemini 3.8 Flash, identifies ambiguous statements or conceptual gaps, and immediately asks a contextual follow-up—just like a Senior Engineer or Staff Tech Lead digging into your design decisions.',
    },
    {
      q: 'What parameters are used to score candidate answers?',
      a: 'Every answer is rigorously evaluated across six dimensions: 1. Technical Accuracy, 2. Conceptual Understanding, 3. Problem-Solving Ability, 4. Answer Completeness, 5. Communication Clarity, and 6. Relevance to the core question. You also receive specific strengths, missing points, and benchmark ideal answers.',
    },
    {
      q: 'Does EduHire-AI support voice interviews?',
      a: 'Yes! The interview room includes built-in Speech-to-Text and Text-to-Speech audio synthesis. You can speak naturally through your microphone, hear the AI interviewer talk back to you, and practice verbal articulation under timed pressure.',
    },
    {
      q: 'How does the Monaco Editor Java coding environment work?',
      a: 'You get a full-featured VS Code-style Monaco Editor supporting Java DSA problems. Code is evaluated against automated test cases with runtime and memory metrics, Big-O complexity feedback, and progressive AI hints.',
    },
    {
      q: 'Can I upload my existing PDF resume to generate tailored questions?',
      a: 'Yes. The Resume Analyzer extracts your claimed tech stack, professional experience, and key projects to ask targeted, project-specific architecture and failure-mode questions based on your actual background.',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Copy & Actions */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-medium text-indigo-600 dark:text-indigo-400">
                <span className="font-semibold uppercase tracking-wider">EduHire-AI Engine</span>
                <span aria-hidden="true">·</span>
                <span>Adaptive Technical & Coding Preparation</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]" style={{ textWrap: 'balance' }}>
                Master High-Stakes Tech Interviews with <span className="text-indigo-600 dark:text-indigo-400">Adaptive AI</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                Realistic, dynamic AI interviewers that challenge your explanations with live follow-up questions, benchmark your code in Monaco Editor, and formulate 7-day personalized roadmaps.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/interview/new"
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-all whitespace-nowrap"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Start Live Interview</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/coding"
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors whitespace-nowrap"
                >
                  <Terminal className="w-4 h-4" />
                  <span>Java Coding Lab</span>
                </Link>

                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 px-5 py-3 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap"
                >
                  <span>Explore Demo Candidate</span>
                </Link>
              </div>

              {/* Trust & Quantitative Proof Adjacency */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-200 dark:border-slate-800 text-xs">
                <div>
                  <div className="font-mono text-lg font-bold text-slate-900 dark:text-white tabular-nums">94.8%</div>
                  <div className="text-slate-500">First-round pass rate</div>
                </div>
                <div>
                  <div className="font-mono text-lg font-bold text-slate-900 dark:text-white tabular-nums">6 Core</div>
                  <div className="text-slate-500">Grading dimensions</div>
                </div>
                <div>
                  <div className="font-mono text-lg font-bold text-slate-900 dark:text-white tabular-nums">0 ms</div>
                  <div className="text-slate-500">Generic static scripts</div>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Mock Preview Card */}
            <div className="lg:col-span-5">
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-indigo-500" />
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      Live AI Session — Staff Java Engineer
                    </span>
                  </div>
                  <span className="text-xs font-mono text-slate-500">04:12 / 30:00</span>
                </div>

                {/* Question bubble */}
                <div className="space-y-1.5">
                  <div className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                    AI Interviewer
                  </div>
                  <div className="text-sm font-medium text-slate-900 dark:text-slate-100 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    "How does Java's ConcurrentHashMap resolve hash collisions while maintaining thread safety without locking the entire table?"
                  </div>
                </div>

                {/* Candidate Answer */}
                <div className="space-y-1.5">
                  <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Candidate Response (Voice Transcribed)
                  </div>
                  <div className="text-xs text-slate-700 dark:text-slate-300 p-3 rounded-lg bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30">
                    "In Java 8, it uses CAS for uninitialized buckets and synchronizes only on the head node of the specific bucket. When chain length exceeds 8, it converts to a Red-Black Tree."
                  </div>
                </div>

                {/* Adaptive follow-up probe */}
                <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200 space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    <span>Adaptive Follow-up Triggered</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    "What happens during concurrent table resizing (transfer)? How do helper threads participate?"
                  </p>
                </div>

                {/* Micro scorecard */}
                <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                  <div className="p-2 rounded bg-slate-50 dark:bg-slate-800 text-xs">
                    <div className="text-[10px] text-slate-500">Accuracy</div>
                    <div className="font-mono font-bold text-slate-900 dark:text-white tabular-nums">92%</div>
                  </div>
                  <div className="p-2 rounded bg-slate-50 dark:bg-slate-800 text-xs">
                    <div className="text-[10px] text-slate-500">Clarity</div>
                    <div className="font-mono font-bold text-slate-900 dark:text-white tabular-nums">88%</div>
                  </div>
                  <div className="p-2 rounded bg-slate-50 dark:bg-slate-800 text-xs">
                    <div className="text-[10px] text-slate-500">Depth</div>
                    <div className="font-mono font-bold text-slate-900 dark:text-white tabular-nums">86%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/40 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="max-w-2xl space-y-3">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Engineered for Real Technical Hiring Standards
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Every component is built around what engineering managers, architects, and hiring committees evaluate.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">Adaptive Follow-Up AI</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Interrogates candidate claims with targeted follow-up questions instead of following a static question script.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Mic className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">Real-Time Voice Interviews</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Integrated speech recognition and text-to-speech audio synthesis simulate a real phone or video screen.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Code2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">Monaco Java Coding Lab</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Full-featured editor with syntax highlighting, automatic test-case validation, Big-O analysis, and AI hints.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">Resume-Grounded Questions</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Upload your PDF resume to generate probing questions about the exact systems, databases, and microservices you built.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">6-Parameter Diagnostic Scoring</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Breaks down accuracy, understanding, completeness, problem solving, communication, and relevance.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">7-Day Targeted Roadmap</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Detects weak performance topics (e.g., Cache Avalanches, GC Pause Times) and generates an actionable study plan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              How EduHire-AI Prepares You
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
              From resume analysis to full simulation and post-interview coaching in 4 simple steps.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
              <div className="font-mono text-sm font-bold text-indigo-600 dark:text-indigo-400">01.</div>
              <h3 className="font-semibold text-sm text-slate-900 dark:text-white">Target Your Role</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Select your job role, experience level, interview format (Technical, HR, Coding, Resume), and tech stack.
              </p>
            </div>

            <div className="p-5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
              <div className="font-mono text-sm font-bold text-indigo-600 dark:text-indigo-400">02.</div>
              <h3 className="font-semibold text-sm text-slate-900 dark:text-white">Engage Live AI Voice</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Answer spoken questions, code live in Monaco Editor, and handle unexpected follow-up challenges.
              </p>
            </div>

            <div className="p-5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
              <div className="font-mono text-sm font-bold text-indigo-600 dark:text-indigo-400">03.</div>
              <h3 className="font-semibold text-sm text-slate-900 dark:text-white">Review Diagnostics</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Examine question-by-question scoring, missing trade-offs, and benchmark ideal answers.
              </p>
            </div>

            <div className="p-5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
              <div className="font-mono text-sm font-bold text-indigo-600 dark:text-indigo-400">04.</div>
              <h3 className="font-semibold text-sm text-slate-900 dark:text-white">Execute 7-Day Plan</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Follow personalized daily drills targeting your lowest-scoring topics until you achieve mastery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Attributable Testimonials */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/30 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
          <div className="max-w-xl space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Proven Candidate Outcomes
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Feedback from candidates who practiced on EduHire-AI before landing top software engineering offers.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed">
                "The adaptive follow-up caught me flat-footed on Java concurrency in the first session. Practicing the 7-day recommended plan on Redis caching helped me ace my final round at Atlassian."
              </p>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div className="font-semibold text-slate-900 dark:text-white">Devin Chen</div>
                <div className="text-slate-500">Senior Backend Engineer, Offer at Atlassian</div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed">
                "Uploading my actual resume and getting grilled on my own payment pipeline architecture made all the difference. It felt exactly like a real hiring committee interview."
              </p>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div className="font-semibold text-slate-900 dark:text-white">Sarah Jenkins</div>
                <div className="text-slate-500">Full Stack Lead, Offer at Stripe</div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed">
                "The Monaco editor test-case runner with Big-O complexity diagnostics prevented me from submitting suboptimal O(N^2) loops. Landed my dream BTech placement!"
              </p>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div className="font-semibold text-slate-900 dark:text-white">Rohan Gupta</div>
                <div className="text-slate-500">BTech CSE Graduate, SDE-1 at Amazon</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Transparent Preparation Tiers
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Start with complimentary practice sessions, then unlock unlimited adaptive simulations.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch">
            {/* Tier 1 */}
            <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="text-sm font-semibold text-slate-900 dark:text-white">Starter Free</div>
                <div className="flex items-baseline gap-1">
                  <span className="font-mono text-3xl font-bold text-slate-900 dark:text-white">$0</span>
                  <span className="text-xs text-slate-500">/ forever</span>
                </div>
                <p className="text-xs text-slate-500">Essential drills for student and entry-level practice.</p>
                <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" /> 3 AI Mock Sessions per month</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" /> Monaco Java Coding Lab access</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" /> Basic Score Diagnostics</li>
                </ul>
              </div>
              <Link to="/interview/new" className="w-full text-center py-2.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                Start Free
              </Link>
            </div>

            {/* Tier 2: Pro */}
            <div className="p-6 rounded-xl border-2 border-indigo-600 dark:border-indigo-500 bg-white dark:bg-slate-900 shadow-md flex flex-col justify-between space-y-6 relative">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">Pro Candidate</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded">Most Popular</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="font-mono text-3xl font-bold text-slate-900 dark:text-white">$24</span>
                  <span className="text-xs text-slate-500">/ month</span>
                </div>
                <p className="text-xs text-slate-500">Complete toolset for engineers targeting Senior & Staff offers.</p>
                <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" /> Unlimited Adaptive Mock Interviews</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" /> Live Voice STT & TTS Audio Mode</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" /> Resume Analyzer & Custom Sessions</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" /> Dynamic 7-Day Personalized Roadmap</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" /> Big-O Complexity & Code Reviewer</li>
                </ul>
              </div>
              <Link to="/interview/new" className="w-full text-center py-2.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors">
                Upgrade to Pro
              </Link>
            </div>

            {/* Tier 3: Enterprise */}
            <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="text-sm font-semibold text-slate-900 dark:text-white">University & Team</div>
                <div className="flex items-baseline gap-1">
                  <span className="font-mono text-3xl font-bold text-slate-900 dark:text-white">$149</span>
                  <span className="text-xs text-slate-500">/ team / mo</span>
                </div>
                <p className="text-xs text-slate-500">For university placement cells, bootcamps, and hiring teams.</p>
                <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" /> Central Placement Cell Dashboard</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" /> Cohort Performance Benchmarks</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" /> Custom Rubrics & Interview Tracks</li>
                </ul>
              </div>
              <Link to="/interview/new" className="w-full text-center py-2.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Everything you need to know about EduHire-AI's adaptive engine.
            </p>
          </div>

          <div className="divide-y divide-slate-200 dark:divide-slate-800">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div key={index} className="py-4">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full flex items-center justify-between text-left gap-4 font-medium text-sm text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-16 bg-indigo-600 dark:bg-indigo-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <h2 className="text-3xl font-extrabold tracking-tight">
            Ready to Ace Your Next Tech Interview?
          </h2>
          <p className="text-indigo-100 text-sm sm:text-base max-w-xl mx-auto">
            Experience realistic adaptive questioning, instant 6-dimension scoring, and personalized study roadmaps right now.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/interview/new"
              className="px-6 py-3 text-sm font-semibold rounded-lg bg-white text-indigo-700 hover:bg-indigo-50 shadow-sm transition-colors whitespace-nowrap"
            >
              Start Free AI Interview
            </Link>
            <Link
              to="/dashboard"
              className="px-6 py-3 text-sm font-semibold rounded-lg bg-indigo-800/80 hover:bg-indigo-800 text-white transition-colors whitespace-nowrap"
            >
              View Sample Dashboard
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
