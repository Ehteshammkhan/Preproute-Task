import type { Test } from "../../types/test.types";
import type { TestData } from "../../store/test.store";

type PreviewTest = Partial<TestData & Test>;

interface TestSummaryCardProps {
  test?: PreviewTest | null;
  questionsCount: number;
  subjectName: string;
  topicNames: string[];
  subTopicNames: string[];
  onEdit: () => void;
}

function TestSummaryCard({
  test,
  questionsCount,
  subjectName,
  topicNames,
  subTopicNames,
  onEdit,
}: TestSummaryCardProps) {
  return (
    <div className="relative rounded-lg border border-gray-200 p-5">
      <button
        type="button"
        onClick={onEdit}
        className="absolute right-5 top-5 text-blue-600"
      >
        ✎
      </button>

      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-full bg-[#09063f] px-4 py-1 text-xs text-white">
          {test?.type === "chapterwise" ? "Chapter Wise" : test?.type || "-"}
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
        <p className="text-gray-700">: {subjectName || "-"}</p>

        <p className="text-gray-400">Topic</p>
        <p className="text-gray-700">
          :{" "}
          {topicNames.length > 0
            ? topicNames.map((item) => (
                <span
                  key={item}
                  className="mr-2 rounded-full border border-yellow-300 bg-yellow-50 px-2 py-0.5 text-xs text-yellow-600"
                >
                  {item}
                </span>
              ))
            : "-"}
        </p>

        <p className="text-gray-400">Sub Topic</p>
        <p className="text-gray-700">
          :{" "}
          {subTopicNames.length > 0
            ? subTopicNames.map((item) => (
                <span
                  key={item}
                  className="mr-2 rounded-full border border-yellow-300 bg-yellow-50 px-2 py-0.5 text-xs text-yellow-600"
                >
                  {item}
                </span>
              ))
            : "-"}
        </p>
      </div>

      <div className="mt-5 flex flex-wrap justify-end gap-2 text-xs text-gray-500">
        <span className="rounded-md border px-3 py-1">
          {test?.total_time || "-"} Min
        </span>

        <span className="rounded-md border px-3 py-1">
          {questionsCount || test?.total_questions || "-"} Q's
        </span>

        <span className="rounded-md border px-3 py-1">
          {test?.total_marks || "-"} Marks
        </span>
      </div>
    </div>
  );
}

export default TestSummaryCard;
