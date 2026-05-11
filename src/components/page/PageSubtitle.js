import Paragraph from "../typography/Paragraph.js";

export default function PageSubtitle({
  text = "",
  className = ""
} = {}) {
  return Paragraph(
    {
      className: `
        page-subtitle
        ${className}
      `.trim()
    },
    text
  );
}