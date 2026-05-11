export function truncate(text = "", max = 60) {
  if (text.length <= max) return text;
  return text.slice(0, max).trim() + "...";
}