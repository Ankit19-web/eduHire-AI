export interface User {
  id: string;
  name: string;
  email: string;
  targetRole: string;
  experienceLevel: string;
}

export interface QuestionItem {
  id: string;
  question: string;
  type: 'technical' | 'hr' | 'behavioral' | 'coding' | 'resume';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topic: string;
  expectedKeyPoints?: string[];
  followUpTrigger?: string;
}

export interface AnswerEvaluation {
  score: number;
  technicalAccuracy: number;
  conceptualUnderstanding: number;
  problemSolving: number;
  completeness: number;
  communicationClarity: number;
  relevance: number;
  strengths: string[];
  missingConcepts: string[];
  mistakes: string[];
  improvements: string[];
  idealAnswer: string;
  followUpQuestion?: string;
}

export interface AnswerRecord {
  questionId: string;
  question: string;
  answerText: string;
  audioDuration?: number;
  evaluation?: AnswerEvaluation;
  answeredAt: string;
}

export interface InterviewReport {
  overallScore: number;
  technicalScore: number;
  communicationScore: number;
  problemSolvingScore: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  recommendedTopics: string[];
}

export interface InterviewSession {
  id: string;
  userId: string;
  title: string;
  jobRole: string;
  experienceLevel: 'Entry' | 'Mid-Level' | 'Senior' | 'Lead';
  interviewType: 'technical' | 'hr' | 'behavioral' | 'coding' | 'resume';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  technologies: string[];
  questionCount: number;
  durationMinutes: number;
  status: 'in-progress' | 'completed' | 'abandoned';
  currentQuestionIndex: number;
  questions: QuestionItem[];
  answers: AnswerRecord[];
  overallScore?: number;
  report?: InterviewReport;
  createdAt: string;
  completedAt?: string;
}

export interface ParsedResume {
  id: string;
  userId: string;
  fileName: string;
  candidateName: string;
  headline: string;
  skills: string[];
  experience: { role: string; company: string; duration: string; description: string }[];
  projects: { title: string; tech: string[]; description: string }[];
  suggestedQuestions: string[];
  createdAt: string;
}

export interface LearningTask {
  id: string;
  title: string;
  description: string;
  duration: string;
  topic: string;
  completed: boolean;
}

export interface LearningDay {
  day: number;
  focus: string;
  tasks: LearningTask[];
  status: 'pending' | 'in-progress' | 'completed';
}

export interface LearningPlan {
  id: string;
  userId: string;
  title: string;
  targetRole: string;
  weakTopics: string[];
  days: LearningDay[];
  createdAt: string;
  updatedAt: string;
}

export interface TestCaseResult {
  id: string;
  testNumber: number;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  passed: boolean;
  runtimeMs: number;
  memoryKb: number;
}
