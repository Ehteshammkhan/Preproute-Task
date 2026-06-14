import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Button, Card, Input, Loader, Select } from "../../components/ui";
import { FormField, RadioGroup, Tabs } from "../../components/forms";

import { useSubjects, useTopics, useSubTopics } from "../../hooks";
import { createTest, getTestById, updateTest } from "../../api/tests.api";
import { useTestStore } from "../../store";
import { QUERY_KEYS } from "../../constants/queryKeys";

import { errorToast, getApiError, successToast } from "../../utils";

function CreateTest() {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();

  const isEditMode = Boolean(id);
  const setTest = useTestStore((state) => state.setTest);

  const [testType, setTestType] = useState("chapterwise");
  const [difficulty, setDifficulty] = useState("easy");

  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [subTopic, setSubTopic] = useState("");

  const [totalTime, setTotalTime] = useState(60);
  const [wrongMarks, setWrongMarks] = useState(-1);
  const [unattemptMarks, setUnattemptMarks] = useState(0);
  const [correctMarks, setCorrectMarks] = useState(5);
  const [totalQuestions, setTotalQuestions] = useState(10);

  const totalMarks = useMemo(() => {
    return totalQuestions * correctMarks;
  }, [totalQuestions, correctMarks]);

  const { data: subjects = [] } = useSubjects();
  const { data: topics = [] } = useTopics(subject);
  const { data: subTopics = [] } = useSubTopics(topic ? [topic] : []);

  const selectedSubject = subjects.find((item: any) => item.id === subject);
  const selectedTopic = topics.find((item: any) => item.id === topic);
  const selectedSubTopic = subTopics.find((item: any) => item.id === subTopic);

  const { data: editTest, isLoading: isEditLoading } = useQuery({
    queryKey: ["test", id],
    queryFn: () => getTestById(id as string),
    enabled: isEditMode,
  });

  useEffect(() => {
    if (!editTest) return;

    setName(editTest.name || "");
    setTestType(editTest.type || "chapterwise");
    setSubject(editTest.subject || "");
    setTopic(editTest.topics?.[0] || "");
    setSubTopic(editTest.sub_topics?.[0] || "");
    setDifficulty(editTest.difficulty || "easy");
    setCorrectMarks(editTest.correct_marks ?? 5);
    setWrongMarks(editTest.wrong_marks ?? -1);
    setUnattemptMarks(editTest.unattempt_marks ?? 0);
    setTotalTime(editTest.total_time ?? 60);
    setTotalQuestions(editTest.total_questions ?? 10);
  }, [editTest]);

  const invalidateTests = () => {
    queryClient.invalidateQueries({
      queryKey: QUERY_KEYS.TESTS,
    });
  };

  const createMutation = useMutation({
    mutationFn: createTest,

    onSuccess: (response) => {
      const createdTest = response.data;

      invalidateTests();

      setTest({
        ...createdTest,
        subject_name: selectedSubject?.name,
        topic_names: selectedTopic ? [selectedTopic.name] : [],
        sub_topic_names: selectedSubTopic ? [selectedSubTopic.name] : [],
      });

      successToast("Test created successfully");
      navigate(`/tests/${createdTest.id}/questions`);
    },

    onError: (error) => {
      errorToast(getApiError(error));
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      testId,
      payload,
    }: {
      testId: string;
      payload: Parameters<typeof updateTest>[1];
    }) => updateTest(testId, payload),

    onSuccess: (response) => {
      const updatedTest = response.data;

      invalidateTests();

      queryClient.invalidateQueries({
        queryKey: ["test", updatedTest.id],
      });

      setTest({
        ...updatedTest,
        subject_name: selectedSubject?.name,
        topic_names: selectedTopic ? [selectedTopic.name] : [],
        sub_topic_names: selectedSubTopic ? [selectedSubTopic.name] : [],
      });

      successToast("Test updated successfully");
      navigate(`/tests/${updatedTest.id}/preview`);
    },

    onError: (error) => {
      errorToast(getApiError(error));
    },
  });

  const handleSubmit = () => {
    if (!name.trim()) {
      errorToast("Test name is required");
      return;
    }

    if (!subject) {
      errorToast("Please select subject");
      return;
    }

    if (!topic) {
      errorToast("Please select topic");
      return;
    }

    const payload = {
      name: name.trim(),
      type: testType,
      subject,
      topics: [topic],
      sub_topics: subTopic ? [subTopic] : [],
      difficulty,
      correct_marks: Math.max(0, correctMarks),
      wrong_marks: wrongMarks > 0 ? -wrongMarks : wrongMarks,
      unattempt_marks: unattemptMarks < 0 ? 0 : unattemptMarks,
      total_time: Math.max(1, totalTime),
      total_marks: Math.max(0, totalMarks),
      total_questions: Math.max(1, totalQuestions),
      status: editTest?.status || "draft",
    };

    if (isEditMode && id) {
      updateMutation.mutate({
        testId: id,
        payload,
      });

      return;
    }

    createMutation.mutate(payload);
  };

  if (isEditLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl">
      <Card className="min-h-[calc(100vh-120px)] shadow-none">
        <div className="mb-8 text-sm text-gray-500">
          Test Creation / {isEditMode ? "Edit Test" : "Create Test"} / Chapter
          Wise
        </div>

        <Tabs
          value={testType}
          onChange={setTestType}
          items={[
            { label: "Chapter Wise", value: "chapterwise" },
            { label: "PYQ", value: "pyq" },
            { label: "Mock Test", value: "mock" },
          ]}
        />

        <div className="mt-8 grid grid-cols-1 gap-x-10 gap-y-8 lg:grid-cols-2">
          <FormField label="Subject">
            <Select
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value);
                setTopic("");
                setSubTopic("");
              }}
              options={subjects.map((item: any) => ({
                label: item.name,
                value: item.id,
              }))}
            />
          </FormField>

          <FormField label="Name of Test">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter name of Test"
            />
          </FormField>

          <FormField label="Topic">
            <Select
              value={topic}
              onChange={(e) => {
                setTopic(e.target.value);
                setSubTopic("");
              }}
              options={topics.map((item: any) => ({
                label: item.name,
                value: item.id,
              }))}
              disabled={!subject || topics.length === 0}
            />
          </FormField>

          <FormField label="Sub Topic">
            <Select
              value={subTopic}
              onChange={(e) => setSubTopic(e.target.value)}
              options={subTopics.map((item: any) => ({
                label: item.name,
                value: item.id,
              }))}
              disabled={!topic || subTopics.length === 0}
            />
          </FormField>

          <FormField label="Duration (Minutes)">
            <Input
              type="number"
              value={totalTime}
              onChange={(e) => setTotalTime(Number(e.target.value))}
              placeholder="Enter the time"
            />
          </FormField>

          <FormField label="Test Difficulty Level">
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
        </div>

        <div className="mt-8">
          <p className="mb-5 text-sm font-medium text-gray-700">
            Marking Scheme:
          </p>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-5">
            <FormField label="Wrong Answer">
              <Input
                type="number"
                value={wrongMarks}
                onChange={(e) => setWrongMarks(Number(e.target.value))}
              />
            </FormField>

            <FormField label="Unattempted">
              <Input
                type="number"
                value={unattemptMarks}
                onChange={(e) => setUnattemptMarks(Number(e.target.value))}
              />
            </FormField>

            <FormField label="Correct Answer">
              <Input
                type="number"
                value={correctMarks}
                onChange={(e) => setCorrectMarks(Number(e.target.value))}
              />
            </FormField>

            <FormField label="No of Questions">
              <Input
                type="number"
                value={totalQuestions}
                onChange={(e) => setTotalQuestions(Number(e.target.value))}
              />
            </FormField>

            <FormField label="Total Marks">
              <Input
                type="number"
                value={totalMarks}
                readOnly
                className="bg-gray-50 text-gray-500"
              />
            </FormField>
          </div>
        </div>

        <div className="mt-10 flex justify-end gap-4">
          <Button
            type="button"
            className="w-auto bg-gray-100 px-10 text-blue-600 hover:bg-gray-200"
            onClick={() =>
              isEditMode && id
                ? navigate(`/tests/${id}/preview`)
                : navigate("/dashboard")
            }
          >
            Cancel
          </Button>

          <Button
            type="button"
            className="w-auto px-10"
            loading={createMutation.isPending || updateMutation.isPending}
            onClick={handleSubmit}
          >
            {isEditMode ? "Save" : "Next"}
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default CreateTest;
