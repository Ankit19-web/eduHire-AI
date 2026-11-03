import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700 dark:text-slate-300">EduHire-AI</span>
          <span aria-hidden="true">·</span>
          <span>Adaptive Technical Interview & Placement Platform</span>
        </div>

        <div className="flex items-center gap-6">
          <Link to="/dashboard" className="hover:text-slate-900 dark:hover:text-white transition-colors">
            Candidate Hub
          </Link>
          <Link to="/interview/new" className="hover:text-slate-900 dark:hover:text-white transition-colors">
            Mock Studio
          </Link>
          <Link to="/coding" className="hover:text-slate-900 dark:hover:text-white transition-colors">
            Java DSA Lab
          </Link>
          <Link to="/resume" className="hover:text-slate-900 dark:hover:text-white transition-colors">
            Resume Matcher
          </Link>
          <Link to="/roadmap" className="hover:text-slate-900 dark:hover:text-white transition-colors">
            7-Day Plan
          </Link>
        </div>

        <p>© 2026 EduHire-AI. Designed for high-stakes engineering interviews.</p>
      </div>
    </footer>
  );
};
