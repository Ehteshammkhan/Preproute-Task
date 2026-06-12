import { Card } from "../ui";
import type { Question } from "../../store/test.store";
import QuestionCard from "./QuestionCard";

interface QuestionsSidebarProps {
  questions: Question[];
  editingIndex: number | null;
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
}

function QuestionsSidebar({
  questions,
  editingIndex,
  onEdit,
  onDelete,
}: QuestionsSidebarProps) {
  return (
    <Card className="shadow-none">
      <h2 className="mb-5 text-lg font-semibold">Questions</h2>

      {questions.length === 0 ? (
        <p className="text-sm text-gray-400">No questions added yet</p>
      ) : (
        <div className="space-y-3">
          {questions.map((question, index) => (
            <QuestionCard
              key={question.id || index}
              question={question}
              index={index}
              isEditing={editingIndex === index}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </Card>
  );
}

export default QuestionsSidebar;
