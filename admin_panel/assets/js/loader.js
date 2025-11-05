export function setLoading(out, state, text) {
  if (!out) return;
  out.textContent = text;
  out.style.color = state ? "#777" : "#000";
}