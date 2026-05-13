import Button from "./Button.js";

export default function PrimaryButton({
  className="",
  onClick,
  type="button",
} = {}, ...children) {
  return Button(
    {
      className: `btn-primary ${className}`.trim(),
      type,onClick
    },
    ...children
  );
}