import api from "./axios";

export const getSubjects = async () => {
  const response = await api.get("/subjects");
  return response.data.data || [];
};

export const getTopicsBySubject = async (subjectId: string) => {
  const response = await api.get(`/topics/subject/${subjectId}`);
  return response.data.data || [];
};

export const getSubTopicsByTopics = async (topicIds: string[]) => {
  const response = await api.post("/sub-topics/multi-topics", {
    topicIds,
  });

  return response.data.data || [];
};