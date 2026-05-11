import Button from "./Button.js";

export default function PrimaryButton(props = {}, ...children) {
  return Button(
    {
      className: `btn-primary ${props.className || ""}`.trim(),
      ...props
    },
    ...children
  );
}