import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";

import { Button, Card, Loader } from "../../components/ui";
import { useTestStore } from "../../store";
import { errorToast, successToast, getApiError } from "../../utils";
import { getTestById, publishTest } from "../../api/tests.api";
import { fetchBulkQuestions } from "../../api/questions.api";

function PreviewPublish() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [publishMode, setPublishMode] = useState<"now" | "schedule">("now");
  const [liveUntil, setLiveUntil] = useState("always");

  const storeTest = useTestStore((state) => state.currentTest);
  const storeQuestions = useTestStore((state) => state.questions);
  const clearTest = useTestStore((state) => state.clearTest);

  const testId = storeTest?.id || id || "";

  const {
    data: apiTest,
    isLoading: isTestLoading,
    isError: isTestError,
    error: testError,
  } = useQuery({
    queryKey: ["test", testId],
    queryFn: () => getTestById(testId),
    enabled: Boolean(testId),
  });

  const test = storeTest || apiTest;
  const questionIds = apiTest?.questions || [];

  const { data: apiQuestions = [], isLoading: isQuestionsLoading } = useQuery({
    queryKey: ["questions", questionIds],
    queryFn: () => fetchBulkQuestions(questionIds),
    enabled: questionIds.length > 0 && storeQuestions.length === 0,
  });

  const questions = storeQuestions.length > 0 ? storeQuestions : apiQuestions;

  const isUuid = (value?: string) => {
    return Boolean(
      value &&
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          value,
        ),
    );
  };

  const displayValue = (value?: string) => {
    if (!value || isUuid(value)) return "-";
    return value;
  };

  const publishMutation = useMutation({
    mutationFn: publishTest,

    onSuccess: () => {
      successToast("Test published successfully");
      clearTest();
      navigate("/dashboard");
    },

    onError: (error) => {
      errorToast(getApiError(error));
    },
  });

  const handlePublish = () => {
    if (!testId) {
      errorToast("Test id not found");
      return;
    }

    if (questions.length < 1) {
      errorToast("Add at least one question");
      return;
    }

    publishMutation.mutate(testId);
  };

  if (isTestLoading || isQuestionsLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (isTestError) {
    return (
      <div className="rounded-lg bg-white p-8 text-center text-red-500">
        {getApiError(testError)}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl">
      <p className="text-sm text-gray-500">Test creation</p>

      <div className="mt-8 flex items-center gap-4">
        <h1 className="text-base font-semibold text-gray-900">Test created</h1>

        <span className="rounded-full border border-green-300 bg-green-50 px-3 py-1 text-xs text-green-600">
          All {questions.length} Questions done
        </span>
      </div>

      <Card className="mt-5 shadow-none">
        <div className="relative rounded-lg border border-gray-200 p-5">
          <button
            type="button"
            onClick={() => navigate(`/tests/${testId}/edit`)}
            className="absolute right-5 top-5 text-blue-600"
          >
            ✎
          </button>

          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-[#09063f] px-4 py-1 text-xs text-white">
              {test?.type === "chapterwise"
                ? "Chapter Wise"
                : test?.type || "-"}
            </span>

            <h2 className="text-base font-semibold">
              {test?.name || "Untitled Test"}
            </h2>

            <span className="rounded-md bg-teal-500 px-3 py-1 text-xs capitalize text-white">
              {test?.difficulty || "-"}
            </span>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 text-sm md:grid-cols-[90px_1fr]">
            <p className="text-gray-400">Subject</p>
            <p className="text-gray-700">: {displayValue(test?.subject)}</p>

            <p className="text-gray-400">Topic</p>
            <p className="text-gray-700">
              :{" "}
              {test?.topics?.length ? (
                test.topics.map((item) => (
                  <span
                    key={item}
                    className="mr-2 rounded-full border border-yellow-300 bg-yellow-50 px-2 py-0.5 text-xs text-yellow-600"
                  >
                    {displayValue(item)}
                  </span>
                ))
              ) : (
                "-"
              )}
            </p>

            <p className="text-gray-400">Sub Topic</p>
            <p className="text-gray-700">
              :{" "}
              {test?.sub_topics?.length ? (
                test.sub_topics.map((item) => (
                  <span
                    key={item}
                    className="mr-2 rounded-full border border-yellow-300 bg-yellow-50 px-2 py-0.5 text-xs text-yellow-600"
                  >
                    {displayValue(item)}
                  </span>
                ))
              ) : (
                "-"
              )}
            </p>
          </div>

          <div className="mt-5 flex flex-wrap justify-end gap-2 text-xs text-gray-500">
            <span className="rounded-md border px-3 py-1">
              {test?.total_time || "-"} Min
            </span>

            <span className="rounded-md border px-3 py-1">
              {questions.length || test?.total_questions || "-"} Q's
            </span>

            <span className="rounded-md border px-3 py-1">
              {test?.total_marks || "-"} Marks
            </span>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="mb-4 text-base font-semibold text-gray-900">
            Questions Preview
          </h3>

          {questions.length === 0 ? (
            <p className="rounded-lg border border-dashed p-8 text-center text-sm text-gray-400">
              No questions added yet
            </p>
          ) : (
            <div className="space-y-4">
              {questions.map((item: any, index: number) => (
                <div
                  key={item.id || index}
                  className="rounded-lg border border-gray-200 bg-white p-4"
                >
                  <p className="font-semibold">
                    Q{index + 1}. {item.question}
                  </p>

                  <div className="mt-3 grid grid-cols-1 gap-2 text-sm text-gray-600 md:grid-cols-2">
                    <p>1. {item.option1}</p>
                    <p>2. {item.option2}</p>
                    <p>3. {item.option3}</p>
                    <p>4. {item.option4}</p>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-4 text-sm">
                    <p className="text-blue-600">
                      Correct: {item.correct_option}
                    </p>

                    <p className="capitalize text-gray-500">
                      Difficulty: {item.difficulty || "-"}
                    </p>
                  </div>

                  {item.explanation && (
                    <p className="mt-3 text-sm text-gray-500">
                      Explanation: {item.explanation}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 inline-flex rounded-lg border border-gray-200 bg-white p-1">
          <button
            type="button"
            onClick={() => setPublishMode("now")}
            className={`rounded-md px-5 py-2 text-sm font-medium ${
              publishMode === "now"
                ? "bg-blue-50 text-blue-700"
                : "text-gray-400"
            }`}
          >
            Publish Now
          </button>

          <button
            type="button"
            onClick={() => setPublishMode("schedule")}
            className={`rounded-md px-5 py-2 text-sm font-medium ${
              publishMode === "schedule"
                ? "bg-blue-50 text-blue-700"
                : "text-gray-400"
            }`}
          >
            Schedule Publish
          </button>
        </div>

        {publishMode === "schedule" && (
          <div className="mt-5">
            <p className="mb-3 text-sm font-semibold text-gray-700">
              Select Date and Time
            </p>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <input
                type="date"
                className="h-11 rounded-lg border border-gray-300 px-4 text-sm outline-none"
              />

              <input
                type="time"
                className="h-11 rounded-lg border border-gray-300 px-4 text-sm outline-none"
              />
            </div>
          </div>
        )}

        <div className="mt-7">
          <h3 className="text-sm font-semibold text-gray-800">Live Until</h3>

          <p className="mt-2 text-sm text-gray-500">
            Choose how long this test should remain available on the platform.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-y-5 md:grid-cols-2">
            {[
              ["always", "Always Available"],
              ["3weeks", "3 Weeks"],
              ["1week", "1 Week"],
              ["1month", "1 Month"],
              ["2weeks", "2 Weeks"],
              ["custom", "Custom Duration"],
            ].map(([value, label]) => (
              <label
                key={value}
                className="flex items-center gap-3 text-sm text-gray-600"
              >
                <input
                  type="radio"
                  checked={liveUntil === value}
                  onChange={() => setLiveUntil(value)}
                  className="h-4 w-4"
                />
                {label}
              </label>
            ))}
          </div>

          {liveUntil === "custom" && (
            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
              <input
                type="date"
                className="h-11 rounded-lg border border-gray-300 px-4 text-sm outline-none"
              />

              <input
                type="time"
                className="h-11 rounded-lg border border-gray-300 px-4 text-sm outline-none"
              />
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-end gap-4">
          <Button
            type="button"
            className="w-auto bg-gray-100 px-10 text-blue-600 hover:bg-gray-200"
            onClick={() => navigate(`/tests/${testId}/questions`)}
          >
            Cancel
          </Button>

          <Button
            type="button"
            className="w-auto px-10"
            loading={publishMutation.isPending}
            onClick={handlePublish}
          >
            Confirm
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default PreviewPublish;