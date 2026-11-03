import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';
import { useTheme } from '../context/ThemeContext.tsx';
import { Sun, Moon, Sparkles, Terminal, FileText, BarChart3, Calendar, User as UserIcon } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const navLinks = [
    { label: 'Dashboard', path: '/dashboard', icon: BarChart3 },
    { label: 'AI Interview', path: '/interview/new', icon: Sparkles },
    { label: 'Coding Lab', path: '/coding', icon: Terminal },
    { label: 'Resume Analyzer', path: '/resume', icon: FileText },
    { label: '7-Day Plan', path: '/roadmap', icon: Calendar },
  ];

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/80 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 h-16">
        {/* Zone 1: Brand Wordmark */}
        <Link to="/" className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity">
          EduHire<span className="text-indigo-600 dark:text-indigo-400">.AI</span>
        </Link>

        {/* Zone 2: Single-line Text Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 py-1 ${
                  isActive
                    ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 opacity-75" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Zone 3: Actions & Profile */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {user ? (
            <div className="flex items-center gap-3">
              <Link
                to="/interview/new"
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-colors whitespace-nowrap shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Start Mock</span>
              </Link>
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
                <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center text-xs font-semibold">
                  {user.name.charAt(0)}
                </div>
                <button
                  onClick={logout}
                  className="text-xs text-slate-500 hover:text-red-500 transition-colors whitespace-nowrap"
                  title="Sign out"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <Link
              to="/auth"
              className="px-3.5 py-1.5 text-xs font-medium rounded-lg text-white bg-slate-900 dark:bg-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors whitespace-nowrap shrink-0"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
