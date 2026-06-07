import { useQuery } from "@tanstack/react-query";
import { getSubTopicsByTopics } from "../api/subjects.api";

export const useSubTopics = (
  topicIds: string[]
) => {
  return useQuery({
    queryKey: [
      "sub-topics",
      topicIds,
    ],

    queryFn: () =>
      getSubTopicsByTopics(
        topicIds
      ),

    enabled:
      topicIds.length > 0,
  });
}; 