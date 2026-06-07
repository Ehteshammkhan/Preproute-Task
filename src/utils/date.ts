export const formatDate = (
  date: string
) => {
  if (!date) return "-";

  return new Date(date)
    .toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
};