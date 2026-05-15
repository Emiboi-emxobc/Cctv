import Button from "./Button.js";

export default function GhostButton({
  className="",
  onClick,
  type="button",
} = {}, ...children) {
  return Button(
    {
      className: `btn-ghost ${className}`.trim(),
      type,onClick
    },
    ...children
  );
}