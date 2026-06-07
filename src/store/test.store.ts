import { create } from "zustand";

export interface Question {
  id?: string;
  type: "mcq";
  subject?: string;
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  correct_option: "option1" | "option2" | "option3" | "option4";
  explanation?: string;
  difficulty?: string;
  topic?: string;
  sub_topic?: string;
  media_url?: string;
  test_id?: string;
}

export interface TestData {
  id?: string;
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

  subject_name?: string;
  topic_names?: string[];
  sub_topic_names?: string[];
}

interface TestStore {
  currentTest: TestData | null;
  questions: Question[];

  setTest: (data: TestData) => void;
  setQuestions: (data: Question[]) => void;
  addQuestion: (question: Question) => void;
  updateQuestion: (index: number, question: Question) => void;
  removeQuestion: (index: number) => void;
  clearTest: () => void;
}

export const useTestStore = create<TestStore>((set) => ({
  currentTest: null,
  questions: [],

  setTest: (data) =>
    set({
      currentTest: data,
    }),

  setQuestions: (data) =>
    set({
      questions: data,
    }),

  addQuestion: (question) =>
    set((state) => ({
      questions: [...state.questions, question],
    })),

  updateQuestion: (index, question) =>
    set((state) => ({
      questions: state.questions.map((item, i) =>
        i === index ? question : item,
      ),
    })),

  removeQuestion: (index) =>
    set((state) => ({
      questions: state.questions.filter((_, i) => i !== index),
    })),

  clearTest: () =>
    set({
      currentTest: null,
      questions: [],
    }),
}));
