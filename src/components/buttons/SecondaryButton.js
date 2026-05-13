import Button from "./Button.js";

export default function SecondaryButton({
  className="",
  onClick,
  type="button",
} = {}, ...children) {
  return Button(
    {
      className: `btn-secondary ${className}`.trim(),
      type,onClick
    },
    ...children
  );
}