import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

import { Card, Loader } from "../../components/ui";
import {
  PublishControls,
  QuestionsPreview,
  TestSummaryCard,
} from "../../components/preview";

import { useTestStore } from "../../store";
import { errorToast, getApiError, successToast, isUuid } from "../../utils";

import { getTestById, publishTest } from "../../api/tests.api";
import { fetchBulkQuestions } from "../../api/questions.api";
import { useSubjects, useSubTopics, useTopics } from "../../hooks";
import { QUERY_KEYS } from "../../constants/queryKeys";

function PreviewPublish() {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();

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

  const test = (storeTest || apiTest) as any;
  const questionIds = apiTest?.questions || [];

  const { data: apiQuestions = [], isLoading: isQuestionsLoading } = useQuery({
    queryKey: ["questions", questionIds],
    queryFn: () => fetchBulkQuestions(questionIds),
    enabled: questionIds.length > 0 && storeQuestions.length === 0,
  });

  const questions = storeQuestions.length > 0 ? storeQuestions : apiQuestions;

  const subjectId = isUuid(test?.subject) ? test?.subject || "" : "";
  const topicIds = test?.topics?.filter((item: string) => isUuid(item)) || [];

  const { data: subjects = [] } = useSubjects();
  const { data: topics = [] } = useTopics(subjectId);
  const { data: subTopics = [] } = useSubTopics(topicIds);

  const getSubjectName = () => {
    if (test?.subject_name) return test.subject_name;
    if (!test?.subject) return "-";
    if (!isUuid(test.subject)) return test.subject;

    const subject = subjects.find((item: any) => item.id === test.subject);
    return subject?.name || "-";
  };

  const getTopicNames = () => {
    if (test?.topic_names?.length) return test.topic_names;
    if (!test?.topics?.length) return [];

    return test.topics.map((item: string) => {
      if (!isUuid(item)) return item;

      const topic = topics.find((topicItem: any) => topicItem.id === item);
      return topic?.name || "-";
    });
  };

  const getSubTopicNames = () => {
    if (test?.sub_topic_names?.length) return test.sub_topic_names;
    if (!test?.sub_topics?.length) return [];

    return test.sub_topics.map((item: string) => {
      if (!isUuid(item)) return item;

      const subTopic = subTopics.find(
        (subTopicItem: any) => subTopicItem.id === item,
      );

      return subTopic?.name || "-";
    });
  };

  const publishMutation = useMutation({
    mutationFn: publishTest,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.TESTS,
      });

      queryClient.invalidateQueries({
        queryKey: ["test", testId],
      });

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
        <TestSummaryCard
          test={test}
          questionsCount={questions.length}
          subjectName={getSubjectName()}
          topicNames={getTopicNames()}
          subTopicNames={getSubTopicNames()}
          onEdit={() => navigate(`/tests/${testId}/edit`)}
        />

        <QuestionsPreview questions={questions} />

        <PublishControls
          isPublishing={publishMutation.isPending}
          onCancel={() => navigate(`/tests/${testId}/questions`)}
          onConfirm={handlePublish}
        />
      </Card>
    </div>
  );
}

export default PreviewPublish;
