
export interface InterviewQuestion {
  id: number;
  question: string;
  context?: string;
}

export interface InterviewResponse {
  nextQuestion?: InterviewQuestion;
  isComplete: boolean;
}

export interface InterviewReport {
  overallScore: number;
  communicationScore: number;
  technicalScore: number;
  jdMatchScore: number;
  thinkingStructureScore?: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  skillGapAnalysis?: string[];
  hiringProbability?: number;
  improvementSuggestions: string[];
  questionEvaluations: {
    question: string;
    answer: string;
    feedback: string;
    score: number;
    improvedAnswer: string;
  }[];
}

export interface Message {
  role: 'user' | 'model';
  text: string;
}

export enum InterviewStatus {
  IDLE = 'idle',
  PARSING = 'parsing',
  READY = 'ready',
  IN_PROGRESS = 'in_progress',
  FETCHING_NEXT = 'fetching_next',
  EVALUATING = 'evaluating',
  COMPLETED = 'completed',
  ERROR = 'error'
}

/** Saved state when user chooses "Resume later" from end-session modal */
export interface PausedInterviewData {
  questions: InterviewQuestion[];
  answers: Record<number, string>;
  currentQuestionIndex: number;
  jdText: string;
  resumeText: string;
  resumeInputMode: 'file' | 'text';
  savedAt: number;
}

export interface InterviewSession {
  resumeText: string;
  jdText: string;
  questions: InterviewQuestion[];
  answers: Record<number, string>;
  report?: InterviewReport;
}
