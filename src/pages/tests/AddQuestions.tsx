import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";

import { Button, Card, Input, Loader } from "../../components/ui";
import { FormField, RadioGroup } from "../../components/forms";
import { useTestStore } from "../../store";
import { errorToast, successToast, getApiError } from "../../utils";

import { getTestById } from "../../api/tests.api";
import {
  createBulkQuestions,
  fetchBulkQuestions,
} from "../../api/questions.api";

function AddQuestions() {
  const navigate = useNavigate();
  const { id } = useParams();

  const currentTest = useTestStore((state) => state.currentTest);
  const questions = useTestStore((state) => state.questions);
  const addQuestion = useTestStore((state) => state.addQuestion);
  const updateQuestion = useTestStore((state) => state.updateQuestion);
  const removeQuestion = useTestStore((state) => state.removeQuestion);
  const setQuestions = useTestStore((state) => state.setQuestions);
  const setTest = useTestStore((state) => state.setTest);

  const testId = currentTest?.id || id || "";

  const [question, setQuestion] = useState("");
  const [option1, setOption1] = useState("");
  const [option2, setOption2] = useState("");
  const [option3, setOption3] = useState("");
  const [option4, setOption4] = useState("");
  const [correctOption, setCorrectOption] = useState("option1");
  const [explanation, setExplanation] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const { data: apiTest, isLoading: isTestLoading } = useQuery({
    queryKey: ["test", testId],
    queryFn: () => getTestById(testId),
    enabled: Boolean(testId),
  });

  const activeTest = currentTest || apiTest;
  const questionIds = apiTest?.questions || [];

  const { data: apiQuestions = [], isLoading: isQuestionsLoading } = useQuery({
    queryKey: ["questions", questionIds],
    queryFn: () => fetchBulkQuestions(questionIds),
    enabled: questionIds.length > 0 && questions.length === 0,
  });

  useEffect(() => {
    if (apiTest && !currentTest) setTest(apiTest as any);
  }, [apiTest, currentTest, setTest]);

  useEffect(() => {
    if (apiQuestions.length > 0 && questions.length === 0) {
      setQuestions(apiQuestions);
    }
  }, [apiQuestions, questions.length, setQuestions]);

  const bulkQuestionMutation = useMutation({
    mutationFn: createBulkQuestions,
    onSuccess: (response) => {
      if (response.data) setQuestions(response.data);
      successToast("Questions saved successfully");
      navigate(`/tests/${testId}/preview`);
    },
    onError: (error) => {
      errorToast(getApiError(error));
    },
  });

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

  const buildQuestion = () => {
    if (!question.trim()) {
      errorToast("Question is required");
      return null;
    }

    if (!option1 || !option2 || !option3 || !option4) {
      errorToast("All 4 options are required");
      return null;
    }

    if (!testId) {
      errorToast("Test id not found");
      return null;
    }

    return {
      type: "mcq" as const,
      subject: activeTest?.subject || "",
      question: question.trim(),
      option1,
      option2,
      option3,
      option4,
      correct_option: correctOption as
        | "option1"
        | "option2"
        | "option3"
        | "option4",
      explanation,
      difficulty,
      test_id: testId,
    };
  };

  const handleEditQuestion = (index: number) => {
    const q = questions[index];

    setEditingIndex(index);
    setQuestion(q.question || "");
    setOption1(q.option1 || "");
    setOption2(q.option2 || "");
    setOption3(q.option3 || "");
    setOption4(q.option4 || "");
    setCorrectOption(q.correct_option || "option1");
    setExplanation(q.explanation || "");
    setDifficulty(q.difficulty || "easy");

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAddQuestion = () => {
    const newQuestion = buildQuestion();
    if (!newQuestion) return;

    if (editingIndex !== null) {
      updateQuestion(editingIndex, newQuestion);
      successToast("Question updated");
    } else {
      addQuestion(newQuestion);
      successToast("Question added");
    }

    resetForm();
  };

  const handleContinue = () => {
    let finalQuestions = [...questions];

    const hasCurrentQuestion =
      question.trim() && option1 && option2 && option3 && option4;

    if (hasCurrentQuestion) {
      const newQuestion = buildQuestion();
      if (!newQuestion) return;

      if (editingIndex !== null) {
        finalQuestions = finalQuestions.map((item, index) =>
          index === editingIndex ? newQuestion : item,
        );
        updateQuestion(editingIndex, newQuestion);
      } else {
        finalQuestions = [...finalQuestions, newQuestion];
        addQuestion(newQuestion);
      }
    }

    if (finalQuestions.length < 1) {
      errorToast("Add at least one question");
      return;
    }

    bulkQuestionMutation.mutate({
      questions: finalQuestions.map((item) => ({
        type: item.type,
        subject: item.subject || activeTest?.subject || "",
        question: item.question,
        option1: item.option1,
        option2: item.option2,
        option3: item.option3,
        option4: item.option4,
        correct_option: item.correct_option,
        explanation: item.explanation || "",
        difficulty: item.difficulty || "easy",
        test_id: item.test_id || testId,
      })),
    });
  };

  if (isTestLoading || isQuestionsLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <p className="text-sm text-gray-500">
          Test Creation / Question Creation
        </p>

        <h1 className="mt-2 text-2xl font-semibold">
          {editingIndex !== null ? "Edit Question" : "Question Creation"}
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
        <Card className="shadow-none">
          <h2 className="mb-5 text-lg font-semibold">Questions</h2>

          {questions.length === 0 ? (
            <p className="text-sm text-gray-400">No questions added yet</p>
          ) : (
            <div className="space-y-3">
              {questions.map((item, index) => (
                <div
                  key={item.id || index}
                  className={`rounded-xl border px-4 py-4 text-sm transition ${
                    editingIndex === index
                      ? "border-green-300 bg-green-50"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="line-clamp-2 font-semibold">
                      Q{index + 1}. {item.question}
                    </p>

                    <div className="flex shrink-0 gap-3">
                      <button
                        type="button"
                        className="text-sm text-blue-600"
                        onClick={() => handleEditQuestion(index)}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="text-sm text-red-500"
                        onClick={() => removeQuestion(index)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="shadow-none">
          <div className="space-y-6">
            <FormField label="Question">
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Enter question"
                className="min-h-28 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
              />
            </FormField>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <FormField label="Option 1">
                <Input
                  value={option1}
                  onChange={(e) => setOption1(e.target.value)}
                  placeholder="Enter option 1"
                />
              </FormField>

              <FormField label="Option 2">
                <Input
                  value={option2}
                  onChange={(e) => setOption2(e.target.value)}
                  placeholder="Enter option 2"
                />
              </FormField>

              <FormField label="Option 3">
                <Input
                  value={option3}
                  onChange={(e) => setOption3(e.target.value)}
                  placeholder="Enter option 3"
                />
              </FormField>

              <FormField label="Option 4">
                <Input
                  value={option4}
                  onChange={(e) => setOption4(e.target.value)}
                  placeholder="Enter option 4"
                />
              </FormField>
            </div>

            <FormField label="Correct Option">
              <RadioGroup
                value={correctOption}
                onChange={setCorrectOption}
                options={[
                  { label: "Option 1", value: "option1" },
                  { label: "Option 2", value: "option2" },
                  { label: "Option 3", value: "option3" },
                  { label: "Option 4", value: "option4" },
                ]}
              />
            </FormField>

            <FormField label="Difficulty">
              <RadioGroup
                value={difficulty}
                onChange={setDifficulty}
                options={[
                  { label: "Easy", value: "easy" },
                  { label: "Medium", value: "medium" },
                  { label: "Difficult", value: "hard" },
                ]}
              />
            </FormField>

            <FormField label="Explanation">
              <textarea
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                placeholder="Enter explanation"
                className="min-h-24 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
              />
            </FormField>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                className="w-auto bg-gray-100 px-8 text-blue-600 hover:bg-gray-200"
                onClick={handleAddQuestion}
              >
                {editingIndex !== null ? "Update Question" : "Add Question"}
              </Button>

              <Button
                type="button"
                className="w-auto px-8"
                loading={bulkQuestionMutation.isPending}
                onClick={handleContinue}
              >
                Save & Continue
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default AddQuestions;
