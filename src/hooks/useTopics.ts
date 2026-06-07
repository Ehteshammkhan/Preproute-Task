import { useQuery } from "@tanstack/react-query";
import { getTopicsBySubject } from "../api/subjects.api";

export const useTopics = (subjectId: string) => {
  return useQuery({
    queryKey: ["topics", subjectId],
    queryFn: () => getTopicsBySubject(subjectId),
    enabled: !!subjectId,
  });
};