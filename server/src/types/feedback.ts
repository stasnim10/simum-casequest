export type Scorecard = {
  structuring: number;
  quant: number;
  insight: number;
  communication: number;
  overall: number;
};

export type FeedbackPayload = {
  userId: string;
  caseId: string;
  steps: Array<{
    name: 'clarifying' | 'hypothesis' | 'structure' | 'quant' | 'recommendation';
    content: string;
  }>;
  exhibits?: Array<{ id: string; text: string }>;
  rubricVersion: string;
};

export type FeedbackResponse = {
  strengths: string[];
  gaps: string[];
  actionItems: string[];
  scorecard: Scorecard;
  nextBestLessonId?: string;
  cached: boolean;
};
