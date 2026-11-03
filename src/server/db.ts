import fs from 'fs';
import path from 'path';

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  targetRole: string;
  experienceLevel: string;
  createdAt: string;
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
  score: number; // 0 - 100
  technicalAccuracy: number; // 0 - 100
  conceptualUnderstanding: number; // 0 - 100
  problemSolving: number; // 0 - 100
  completeness: number; // 0 - 100
  communicationClarity: number; // 0 - 100
  relevance: number; // 0 - 100
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
  report?: {
    overallScore: number;
    technicalScore: number;
    communicationScore: number;
    problemSolvingScore: number;
    summary: string;
    strengths: string[];
    weaknesses: string[];
    recommendedTopics: string[];
  };
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

interface DatabaseSchema {
  users: User[];
  interviews: InterviewSession[];
  resumes: ParsedResume[];
  learningPlans: LearningPlan[];
}

const DB_FILE = path.resolve(process.cwd(), '.data', 'eduhire-db.json');

function ensureDbDirectory() {
  const dir = path.dirname(DB_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function loadInitialData(): DatabaseSchema {
  // Pre-seed demo user: alex.dev@eduhire.ai / password123
  // bcrypt hash for "password123":
  const defaultPasswordHash = '$2a$10$wTqKjU4.B3X2tK3yK8K2..xY2fU3h8O6lq2wE8j1aGZ2hN3lF7k6y';

  const demoUserId = 'user_demo_101';
  const sampleInterviewId = 'interview_sample_901';

  const defaultUser: User = {
    id: demoUserId,
    name: 'Alex Rivera',
    email: 'alex.dev@eduhire.ai',
    passwordHash: defaultPasswordHash,
    targetRole: 'Full Stack Java Engineer',
    experienceLevel: 'Mid-Level',
    createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
  };

  const sampleInterview: InterviewSession = {
    id: sampleInterviewId,
    userId: demoUserId,
    title: 'Java & Spring Boot System Design Interview',
    jobRole: 'Senior Java Developer',
    experienceLevel: 'Mid-Level',
    interviewType: 'technical',
    difficulty: 'Medium',
    technologies: ['Java', 'Spring Boot', 'PostgreSQL', 'Kafka', 'Redis'],
    questionCount: 4,
    durationMinutes: 30,
    status: 'completed',
    currentQuestionIndex: 4,
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    completedAt: new Date(Date.now() - 2 * 86400000 + 1600000).toISOString(),
    overallScore: 84,
    questions: [
      {
        id: 'q_1',
        question: 'Explain how ConcurrentHashMap achieves thread-safety in Java 8 compared to earlier versions using Segment locking.',
        type: 'technical',
        difficulty: 'Medium',
        topic: 'Java Concurrency',
        expectedKeyPoints: ['CAS (Compare-And-Swap)', 'Synchronized node level locking', 'Red-Black tree conversion at treeify threshold 8'],
      },
      {
        id: 'q_2',
        question: 'In Spring Boot, how does the @Transactional annotation work under the hood with AOP Proxies, and why does self-invocation bypass transactions?',
        type: 'technical',
        difficulty: 'Medium',
        topic: 'Spring Framework',
        expectedKeyPoints: ['Dynamic Proxies / CGLIB', 'Proxy interceptor mechanism', 'Bypassing proxy on this.methodCall()'],
      },
      {
        id: 'q_3',
        question: 'How would you mitigate the Thundering Herd / Cache Avalanche problem in a high-traffic microservices architecture backed by Redis?',
        type: 'technical',
        difficulty: 'Hard',
        topic: 'System Design & Caching',
        expectedKeyPoints: ['TTL Jitter / random expiration', 'Mutex lock / Singleflight pattern', 'Background pre-warming cache'],
      },
      {
        id: 'q_4',
        question: 'What happens in the JVM during Garbage Collection when the G1 GC triggers a Concurrent Mark cycle?',
        type: 'technical',
        difficulty: 'Hard',
        topic: 'JVM Internals',
        expectedKeyPoints: ['Initial Mark', 'Concurrent Marking with SATB', 'Remark & Cleanup', 'Copying to survivor regions'],
      },
    ],
    answers: [
      {
        questionId: 'q_1',
        question: 'Explain how ConcurrentHashMap achieves thread-safety in Java 8 compared to earlier versions using Segment locking.',
        answerText: 'In Java 8, ConcurrentHashMap replaced segment-based reentrant locks with a synchronized block on the first node of each bucket combined with CAS (Compare-And-Swap) operations for empty buckets. It also converts buckets from linked lists to red-black trees when the bin count exceeds 8.',
        answeredAt: new Date(Date.now() - 2 * 86400000 + 400000).toISOString(),
        evaluation: {
          score: 88,
          technicalAccuracy: 90,
          conceptualUnderstanding: 88,
          problemSolving: 85,
          completeness: 86,
          communicationClarity: 90,
          relevance: 92,
          strengths: ['Accurately contrasted Java 7 segments with Java 8 node locks', 'Highlighted CAS for uninitialized buckets', 'Correctly stated the treeify threshold of 8'],
          missingConcepts: ['Did not mention sizing table counter cells (LongAdder mechanism)'],
          mistakes: [],
          improvements: ['Add mention of how size() is computed concurrently across CounterCells.'],
          idealAnswer: 'Java 8 removed the ReentrantLock-based Segment table. It uses CAS for inserting into empty bins and synchronized(node) on the head node for occupied bins, minimizing contention to a single bucket. It also implements LongAdder-style CounterCell striping for high-throughput size counts.',
        },
      },
      {
        questionId: 'q_2',
        question: 'In Spring Boot, how does the @Transactional annotation work under the hood with AOP Proxies, and why does self-invocation bypass transactions?',
        answerText: 'Spring wraps the bean in a dynamic proxy or CGLIB proxy. When another bean calls the method, the TransactionInterceptor intercepts the call, starts or joins a transaction via the PlatformTransactionManager, and commits or rolls back upon completion. With self-invocation, the call is made directly on this without going through the proxy.',
        answeredAt: new Date(Date.now() - 2 * 86400000 + 800000).toISOString(),
        evaluation: {
          score: 85,
          technicalAccuracy: 88,
          conceptualUnderstanding: 86,
          problemSolving: 82,
          completeness: 84,
          communicationClarity: 88,
          relevance: 90,
          strengths: ['Identified CGLIB/JDK dynamic proxy interceptors', 'Correctly noted that direct "this" bypasses interceptors'],
          missingConcepts: ['Workarounds such as injecting self proxy or using TransactionTemplate'],
          mistakes: [],
          improvements: ['Mention solutions: @EnableAspectJAutoProxy(exposeProxy=true) or refactoring into a separate helper service.'],
          idealAnswer: 'Spring creates a proxy wrapper. Method invocations from outside pass through TransactionInterceptor. Self-invocation calls this.targetMethod(), invoking the target instance directly, thus bypassing the proxy advice.',
        },
      },
    ],
    report: {
      overallScore: 84,
      technicalScore: 87,
      communicationScore: 88,
      problemSolvingScore: 78,
      summary: 'Candidate demonstrated strong mastery of Java core concurrency and Spring framework internals. Recommended to deepen system design caching strategies and JVM memory profiling.',
      strengths: [
        'Precise understanding of JVM memory mechanics and CAS primitives',
        'Clear explanation of Spring AOP proxy interception',
        'Concise and structured communication',
      ],
      weaknesses: [
        'System design caching mitigation could provide more concrete trade-offs',
        'Could elaborate further on JVM GC pause-time tuning flags',
      ],
      recommendedTopics: [
        'Redis Distributed Locking & Cache Stampede Solutions',
        'G1 GC Garbage Collector Ergonomics & JVM Flags',
        'PostgreSQL Transaction Isolation Levels & MVCC',
      ],
    },
  };

  const sampleResume: ParsedResume = {
    id: 'resume_sample_1',
    userId: demoUserId,
    fileName: 'Alex_Rivera_Senior_Java_Engineer.pdf',
    candidateName: 'Alex Rivera',
    headline: 'Senior Full Stack Software Engineer | Java, Spring Boot, React, Distributed Systems',
    skills: ['Java 21', 'Spring Boot 3', 'Microservices', 'PostgreSQL', 'Redis', 'Kafka', 'Docker', 'Kubernetes', 'React', 'TypeScript', 'AWS'],
    experience: [
      {
        role: 'Senior Software Engineer',
        company: 'CloudScale FinTech',
        duration: '2023 - Present',
        description: 'Architected high-throughput payment settlement engine handling 12k transactions/sec with 99.99% availability using Spring Boot and Apache Kafka.',
      },
      {
        role: 'Software Engineer',
        company: 'Nexis Systems',
        duration: '2021 - 2023',
        description: 'Built REST and GraphQL APIs for client portfolio management, reduced Redis query latency by 45% through key sharding and pipeline caching.',
      },
    ],
    projects: [
      {
        title: 'Event-Driven Order Processing Pipeline',
        tech: ['Java', 'Spring Cloud Stream', 'Kafka', 'PostgreSQL'],
        description: 'Decoupled payment authorization and inventory reservations with saga orchestration, reducing transaction abort rates by 38%.',
      },
      {
        title: 'Distributed Rate Limiter Service',
        tech: ['Go', 'Redis', 'Docker'],
        description: 'Implemented sliding window log and token bucket algorithms capable of evaluating 50k requests/sec.',
      },
    ],
    suggestedQuestions: [
      'In your Event-Driven Order Processing Pipeline, how did you handle duplicate events or out-of-order Kafka message deliveries during a Saga step?',
      'How did you ensure idempotent payment captures in the CloudScale FinTech settlement engine when network timeouts occurred?',
      'Can you explain the trade-offs between sliding window log and token bucket algorithms from your Distributed Rate Limiter project?',
    ],
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  };

  const sampleLearningPlan: LearningPlan = {
    id: 'plan_sample_1',
    userId: demoUserId,
    title: '7-Day Senior Backend & Distributed Systems Mastery Plan',
    targetRole: 'Senior Java Developer',
    weakTopics: ['Distributed Caching & Redis Avalanche', 'JVM Garbage Collection Profiling', 'Database Deadlock Resolution'],
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
    days: [
      {
        day: 1,
        focus: 'Distributed Caching & Cache Stampede Solutions',
        status: 'completed',
        tasks: [
          { id: 't_1_1', title: 'Study Redis Mutex & Probabilistic Early Expiration (XFetch)', description: 'Understand how locking prevents dog-piling on DB during cache miss.', duration: '45 mins', topic: 'Caching', completed: true },
          { id: 't_1_2', title: 'Code a Cache-Aside wrapper in Java with TTL Jitter', description: 'Implement an automatic jitter formula to disperse key expirations.', duration: '60 mins', topic: 'Java', completed: true },
        ],
      },
      {
        day: 2,
        focus: 'JVM G1 vs ZGC Garbage Collection Mechanics',
        status: 'in-progress',
        tasks: [
          { id: 't_2_1', title: 'Deep dive into G1 GC regions, humongous objects & RSet', description: 'Review Remembered Sets and card table mark sweeps.', duration: '45 mins', topic: 'JVM', completed: true },
          { id: 't_2_2', title: 'Simulate memory leak using VisualVM or JConsole', description: 'Create static collection memory leak and capture heap dump.', duration: '60 mins', topic: 'Debugging', completed: false },
        ],
      },
      {
        day: 3,
        focus: 'Kafka Consumer Offsets & Exactly-Once Semantics',
        status: 'pending',
        tasks: [
          { id: 't_3_1', title: 'Transactional Producer and Consumer Read Committed', description: 'Master isolation.level=read_committed and idempotent producer configuration.', duration: '50 mins', topic: 'Kafka', completed: false },
          { id: 't_3_2', title: 'Implement out-of-order message compensation handler', description: 'Write a consumer logic handling late arrival updates.', duration: '60 mins', topic: 'Event-Driven', completed: false },
        ],
      },
      {
        day: 4,
        focus: 'PostgreSQL Locking, MVCC & Deadlock Mitigation',
        status: 'pending',
        tasks: [
          { id: 't_4_1', title: 'Analyze EXPLAIN ANALYZE for sequential vs index scans', description: 'Identify table scan bottlenecks and optimize composite index B-Trees.', duration: '45 mins', topic: 'SQL', completed: false },
          { id: 't_4_2', title: 'Simulate Row-Level Deadlocks with SELECT FOR UPDATE', description: 'Learn deterministic lock ordering across multi-table operations.', duration: '60 mins', topic: 'Database', completed: false },
        ],
      },
      {
        day: 5,
        focus: 'Spring Boot Microservices Security & Resilience',
        status: 'pending',
        tasks: [
          { id: 't_5_1', title: 'Resilience4j Circuit Breaker & Rate Limiter Configuration', description: 'Implement fallback patterns and graceful degradation under load.', duration: '50 mins', topic: 'Spring', completed: false },
        ],
      },
      {
        day: 6,
        focus: 'System Design Mock: Real-Time Payment Ledger',
        status: 'pending',
        tasks: [
          { id: 't_6_1', title: 'Design double-entry bookkeeping engine with idempotent keys', description: 'Diagram data flow, audit log, and reconciliation workers.', duration: '75 mins', topic: 'Architecture', completed: false },
        ],
      },
      {
        day: 7,
        focus: 'Full Mock Interview & Behavioral STAR Calibration',
        status: 'pending',
        tasks: [
          { id: 't_7_1', title: 'Conduct full 45-minute AI Voice Interview session', description: 'Test adaptive follow-up handling on technical questions.', duration: '45 mins', topic: 'Mock Interview', completed: false },
          { id: 't_7_2', title: 'Review diagnostic report and celebrate completion', description: 'Compare initial 84 score with final mastery score.', duration: '30 mins', topic: 'Evaluation', completed: false },
        ],
      },
    ],
  };

  return {
    users: [defaultUser],
    interviews: [sampleInterview],
    resumes: [sampleResume],
    learningPlans: [sampleLearningPlan],
  };
}

class Database {
  private data: DatabaseSchema;

  constructor() {
    ensureDbDirectory();
    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
      } catch {
        this.data = loadInitialData();
        this.save();
      }
    } else {
      this.data = loadInitialData();
      this.save();
    }
  }

  private save() {
    try {
      ensureDbDirectory();
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error saving database to file:', err);
    }
  }

  // Users
  findUserByEmail(email: string): User | undefined {
    return this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  findUserById(id: string): User | undefined {
    return this.data.users.find((u) => u.id === id);
  }

  createUser(user: Omit<User, 'id' | 'createdAt'>): User {
    const newUser: User = {
      ...user,
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
    };
    this.data.users.push(newUser);
    this.save();
    return newUser;
  }

  // Interviews
  getInterviewsByUserId(userId: string): InterviewSession[] {
    return this.data.interviews
      .filter((i) => i.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getInterviewById(id: string): InterviewSession | undefined {
    return this.data.interviews.find((i) => i.id === id);
  }

  createInterview(interview: Omit<InterviewSession, 'id' | 'createdAt' | 'status' | 'currentQuestionIndex' | 'answers'>): InterviewSession {
    const newSession: InterviewSession = {
      ...interview,
      id: `int_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      status: 'in-progress',
      currentQuestionIndex: 0,
      answers: [],
      createdAt: new Date().toISOString(),
    };
    this.data.interviews.unshift(newSession);
    this.save();
    return newSession;
  }

  updateInterview(id: string, updates: Partial<InterviewSession>): InterviewSession | undefined {
    const session = this.data.interviews.find((i) => i.id === id);
    if (!session) return undefined;

    Object.assign(session, updates);
    this.save();
    return session;
  }

  deleteInterview(id: string): boolean {
    const idx = this.data.interviews.findIndex((i) => i.id === id);
    if (idx !== -1) {
      this.data.interviews.splice(idx, 1);
      this.save();
      return true;
    }
    return false;
  }

  // Resumes
  getResumesByUserId(userId: string): ParsedResume[] {
    return this.data.resumes
      .filter((r) => r.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getResumeById(id: string): ParsedResume | undefined {
    return this.data.resumes.find((r) => r.id === id);
  }

  createResume(resume: Omit<ParsedResume, 'id' | 'createdAt'>): ParsedResume {
    const newResume: ParsedResume = {
      ...resume,
      id: `res_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
    };
    this.data.resumes.unshift(newResume);
    this.save();
    return newResume;
  }

  // Learning Plans
  getLearningPlanByUserId(userId: string): LearningPlan | undefined {
    return this.data.learningPlans
      .filter((p) => p.userId === userId)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0];
  }

  createLearningPlan(plan: Omit<LearningPlan, 'id' | 'createdAt' | 'updatedAt'>): LearningPlan {
    const newPlan: LearningPlan = {
      ...plan,
      id: `plan_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.data.learningPlans.unshift(newPlan);
    this.save();
    return newPlan;
  }

  updateLearningPlan(id: string, updates: Partial<LearningPlan>): LearningPlan | undefined {
    const plan = this.data.learningPlans.find((p) => p.id === id);
    if (!plan) return undefined;
    Object.assign(plan, { ...updates, updatedAt: new Date().toISOString() });
    this.save();
    return plan;
  }
}

export const db = new Database();
