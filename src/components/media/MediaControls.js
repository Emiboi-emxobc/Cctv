import Div from "../Div.js";

export default function MediaControls(children) {
  return Div(
    { className: "media-controls" },
    ...children
  );
}