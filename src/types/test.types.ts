export interface Test {
  id: string;
  name: string;
  type?: string;
  subject?: string;
  topics?: string[];
  sub_topics?: string[];
  questions?: string[] | null;
  correct_marks?: number;
  wrong_marks?: number;
  unattempt_marks?: number;
  difficulty?: string;
  total_time?: number;
  total_marks?: number;
  total_questions?: number;
  status?: string | null;
  created_at?: string;
}

export interface TestFormData {
  name: string;
  type: string;
  subject: string;
  topics: string[];
  sub_topics: string[];
  difficulty: string;
  correct_marks: number;
  wrong_marks: number;
  unattempt_marks: number;
  total_time: number;
  total_marks: number;
  total_questions: number;
  status?: string | null;
}