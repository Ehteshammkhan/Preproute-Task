import api from "./axios";
import type { Question } from "../store/test.store";

interface BulkQuestionsPayload {
  questions: Question[];
}

export const createBulkQuestions = async (data: BulkQuestionsPayload) => {
  const response = await api.post("/questions/bulk", data);
  return response.data;
};

export const fetchBulkQuestions = async (questionIds: string[]) => {
  const response = await api.post("/questions/fetchBulk", {
    question_ids: questionIds,
  });

  return response.data.data || [];
};