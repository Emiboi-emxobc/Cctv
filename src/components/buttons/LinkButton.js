import Button from "./Button.js";

export default function LinkButton({
  href,
  className = "",
  children
}) {
  return Button(
    {
      className: `link-btn ${className}`.trim(),
      onClick: () => window.router.navigate(href)
    },
    children
  );
}