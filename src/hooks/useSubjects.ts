import { useQuery } from "@tanstack/react-query";
import { getSubjects } from "../api/subjects.api";

export const useSubjects = () => {
  return useQuery({
    queryKey: ["subjects"],
    queryFn: getSubjects,
  });
};