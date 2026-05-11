import Title from "../typography/Title.js";

export default function PageTitle({
  text = "",
  level = 1,
  className = "",
  centered = false,
  muted = false
} = {}) {
  return Title(
    {
      level,
      className: `
        page-title
        ${centered ? "page-title-center" : ""}
        ${muted ? "page-title-muted" : ""}
        ${className}
      `.trim()
    },
    text
  );
}