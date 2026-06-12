import type { Question } from "../../store/test.store";

interface QuestionsPreviewProps {
  questions: Question[];
}

function QuestionsPreview({ questions }: QuestionsPreviewProps) {
  return (
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
          {questions.map((item, index) => (
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
                <p className="text-blue-600">Correct: {item.correct_option}</p>

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
  );
}

export default QuestionsPreview;
