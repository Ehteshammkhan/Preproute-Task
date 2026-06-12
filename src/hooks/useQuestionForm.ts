import { useState } from "react";
import type { Question } from "../store/test.store";

type CorrectOption = "option1" | "option2" | "option3" | "option4";

export const useQuestionForm = () => {
  const [question, setQuestion] = useState("");
  const [option1, setOption1] = useState("");
  const [option2, setOption2] = useState("");
  const [option3, setOption3] = useState("");
  const [option4, setOption4] = useState("");
  const [correctOption, setCorrectOption] =
    useState<CorrectOption>("option1");
  const [explanation, setExplanation] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const resetForm = () => {
    setQuestion("");
    setOption1("");
    setOption2("");
    setOption3("");
    setOption4("");
    setCorrectOption("option1");
    setExplanation("");
    setDifficulty("easy");
    setEditingIndex(null);
  };

  const fillForm = (q: Question, index: number) => {
    setEditingIndex(index);
    setQuestion(q.question || "");
    setOption1(q.option1 || "");
    setOption2(q.option2 || "");
    setOption3(q.option3 || "");
    setOption4(q.option4 || "");
    setCorrectOption(q.correct_option || "option1");
    setExplanation(q.explanation || "");
    setDifficulty(q.difficulty || "easy");
  };

  return {
    question,
    setQuestion,
    option1,
    setOption1,
    option2,
    setOption2,
    option3,
    setOption3,
    option4,
    setOption4,
    correctOption,
    setCorrectOption,
    explanation,
    setExplanation,
    difficulty,
    setDifficulty,
    editingIndex,
    setEditingIndex,
    resetForm,
    fillForm,
  };
};