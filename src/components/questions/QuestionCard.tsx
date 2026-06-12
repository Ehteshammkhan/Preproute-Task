import type { Question } from "../../store/test.store";

interface QuestionCardProps {
  question: Question;
  index: number;
  isEditing: boolean;
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
}

function QuestionCard({
  question,
  index,
  isEditing,
  onEdit,
  onDelete,
}: QuestionCardProps) {
  return (
    <div
      className={`rounded-xl border px-4 py-4 text-sm transition ${
        isEditing ? "border-green-300 bg-green-50" : "border-gray-200 bg-white"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="line-clamp-2 font-semibold">
          Q{index + 1}. {question.question}
        </p>

        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            className="text-sm text-blue-600"
            onClick={() => onEdit(index)}
          >
            Edit
          </button>

          <button
            type="button"
            className="text-sm text-red-500"
            onClick={() => onDelete(index)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default QuestionCard;
