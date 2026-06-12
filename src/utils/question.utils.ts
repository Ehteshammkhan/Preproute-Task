import type { Question } from "../store/test.store";

export const isQuestionComplete = (
  question: string,
  option1: string,
  option2: string,
  option3: string,
  option4: string
) => {
  return Boolean(question.trim() && option1 && option2 && option3 && option4);
};

export const mapQuestionsPayload = (
  questions: Question[],
  subject: string,
  testId: string
) => {
  return questions.map((item) => ({
    type: item.type,
    subject: item.subject || subject,
    question: item.question,
    option1: item.option1,
    option2: item.option2,
    option3: item.option3,
    option4: item.option4,
    correct_option: item.correct_option,
    explanation: item.explanation || "",
    difficulty: item.difficulty || "easy",
    test_id: item.test_id || testId,
  }));
};