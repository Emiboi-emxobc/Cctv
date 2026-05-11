import Button from "./Button.js";

export default function SecondaryButton(props = {}, ...children) {
   return Button(
      {
         className: `btn-secondary ${props.className || ""}`.trim(),
         ...props
      },
      ...children
   );
}