import { z } from "zod";

export const testSchema = z.object({
  name: z.string().min(1, "Test name is required"),
  type: z.string().min(1, "Test type is required"),
  subject: z.string().min(1, "Subject is required"),
  topics: z.array(z.string()).min(1, "Select at least one topic"),
  sub_topics: z.array(z.string()).default([]),
  difficulty: z.string().min(1, "Difficulty is required"),
  correct_marks: z.coerce.number().min(0),
  wrong_marks: z.coerce.number(),
  unattempt_marks: z.coerce.number(),
  total_time: z.coerce.number().min(1),
  total_marks: z.coerce.number().min(1),
  total_questions: z.coerce.number().min(1),
});

export type TestFormData = z.infer<typeof testSchema>;