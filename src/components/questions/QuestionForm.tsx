import { Button, Card, Input } from "../ui";
import { FormField, RadioGroup } from "../forms";

type CorrectOption = "option1" | "option2" | "option3" | "option4";

interface QuestionFormProps {
  question: string;
  setQuestion: (value: string) => void;

  option1: string;
  setOption1: (value: string) => void;

  option2: string;
  setOption2: (value: string) => void;

  option3: string;
  setOption3: (value: string) => void;

  option4: string;
  setOption4: (value: string) => void;

  correctOption: CorrectOption;
  setCorrectOption: (value: CorrectOption) => void;

  explanation: string;
  setExplanation: (value: string) => void;

  difficulty: string;
  setDifficulty: (value: string) => void;

  editingIndex: number | null;

  isSaving: boolean;
  onAddQuestion: () => void;
  onSaveContinue: () => void;
}

function QuestionForm({
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
  isSaving,
  onAddQuestion,
  onSaveContinue,
}: QuestionFormProps) {
  return (
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
            onChange={(value) => setCorrectOption(value as CorrectOption)}
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
            onClick={onAddQuestion}
          >
            {editingIndex !== null ? "Update Question" : "Add Question"}
          </Button>

          <Button
            type="button"
            className="w-auto px-8"
            loading={isSaving}
            onClick={onSaveContinue}
          >
            Save & Continue
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default QuestionForm;
