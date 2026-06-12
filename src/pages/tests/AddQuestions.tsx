import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";

import { Loader } from "../../components/ui";
import { QuestionForm, QuestionsSidebar } from "../../components/questions";
import { useTestStore } from "../../store";
import { errorToast, successToast, getApiError } from "../../utils";

import { getTestById } from "../../api/tests.api";
import {
  createBulkQuestions,
  fetchBulkQuestions,
} from "../../api/questions.api";

import { useQuestionForm } from "../../hooks";
import {
  isQuestionComplete,
  mapQuestionsPayload,
} from "../../utils/question.utils";

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

  const {
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
    resetForm,
    fillForm,
  } = useQuestionForm();

  const testId = currentTest?.id || id || "";

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
    if (apiTest && !currentTest) {
      setTest(apiTest as any);
    }
  }, [apiTest, currentTest, setTest]);

  useEffect(() => {
    if (apiQuestions.length > 0 && questions.length === 0) {
      setQuestions(apiQuestions);
    }
  }, [apiQuestions, questions.length, setQuestions]);

  const bulkQuestionMutation = useMutation({
    mutationFn: createBulkQuestions,

    onSuccess: (response) => {
      if (response.data) {
        setQuestions(response.data);
      }

      successToast("Questions saved successfully");
      navigate(`/tests/${testId}/preview`);
    },

    onError: (error) => {
      errorToast(getApiError(error));
    },
  });

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
      correct_option: correctOption,
      explanation,
      difficulty,
      test_id: testId,
    };
  };

  const handleEditQuestion = (index: number) => {
    const selectedQuestion = questions[index];

    fillForm(selectedQuestion, index);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
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

    const hasCurrentQuestion = isQuestionComplete(
      question,
      option1,
      option2,
      option3,
      option4,
    );

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
      questions: mapQuestionsPayload(
        finalQuestions,
        activeTest?.subject || "",
        testId,
      ),
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
        <QuestionsSidebar
          questions={questions}
          editingIndex={editingIndex}
          onEdit={handleEditQuestion}
          onDelete={removeQuestion}
        />

        <QuestionForm
          question={question}
          setQuestion={setQuestion}
          option1={option1}
          setOption1={setOption1}
          option2={option2}
          setOption2={setOption2}
          option3={option3}
          setOption3={setOption3}
          option4={option4}
          setOption4={setOption4}
          correctOption={correctOption}
          setCorrectOption={setCorrectOption}
          explanation={explanation}
          setExplanation={setExplanation}
          difficulty={difficulty}
          setDifficulty={setDifficulty}
          editingIndex={editingIndex}
          isSaving={bulkQuestionMutation.isPending}
          onAddQuestion={handleAddQuestion}
          onSaveContinue={handleContinue}
        />
      </div>
    </div>
  );
}

export default AddQuestions;
