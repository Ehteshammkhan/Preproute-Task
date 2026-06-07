import api from "./axios";
import type { Test } from "../types/test.types";
import type { TestFormData } from "../validations/test.schema";

export const getTests = async (): Promise<Test[]> => {
  const response = await api.get("/tests");
  return response.data.data || [];
};

export const getTestById = async (testId: string): Promise<Test> => {
  const response = await api.get(`/tests/${testId}`);
  return response.data.data;
};

export const createTest = async (data: TestFormData) => {
  const response = await api.post("/tests", {
    ...data,
    status: "draft",
  });

  return response.data;
};

export const updateTest = async (
  testId: string,
  data: Partial<TestFormData>
) => {
  const response = await api.put(`/tests/${testId}`, data);

  return response.data;
};

export const publishTest = async (testId: string) => {
  const response = await api.put(`/tests/${testId}`, {
    status: "live",
  });

  return response.data;
};