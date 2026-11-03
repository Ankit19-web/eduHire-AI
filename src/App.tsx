import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import { Navbar } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';
import { LandingPage } from './pages/LandingPage.tsx';
import { DashboardPage } from './pages/DashboardPage.tsx';
import { InterviewSetupPage } from './pages/InterviewSetupPage.tsx';
import { InterviewRoomPage } from './pages/InterviewRoomPage.tsx';
import { CodingStudioPage } from './pages/CodingStudioPage.tsx';
import { ResumeAnalyzerPage } from './pages/ResumeAnalyzerPage.tsx';
import { ReportDetailPage } from './pages/ReportDetailPage.tsx';
import { LearningPlanPage } from './pages/LearningPlanPage.tsx';
import { AuthPage } from './pages/AuthPage.tsx';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/interview/new" element={<InterviewSetupPage />} />
                <Route path="/interview/:id" element={<InterviewRoomPage />} />
                <Route path="/coding" element={<CodingStudioPage />} />
                <Route path="/resume" element={<ResumeAnalyzerPage />} />
                <Route path="/report/:id" element={<ReportDetailPage />} />
                <Route path="/roadmap" element={<LearningPlanPage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
