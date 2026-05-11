export function loadCss(href) {
  const id = "page-css";

  const existing = document.getElementById(id);
  if (existing) existing.remove();

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  link.id = id;

  document.head.appendChild(link);
}