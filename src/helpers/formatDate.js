export function formatDate(
  date,
  locale = "en-NG",
  options = {}
) {
  return new Date(date).toLocaleDateString(
    locale,
    {
      year: "numeric",
      month: "short",
      day: "numeric",
      ...options
    }
  );
}