import GhostButton from "../buttons/GhostButton.js";
import Icon from "./Icon.js";

export default function IconButton({
  icon = "shopping-cart",
  route = "/",
  className = ""
} = {}, ...children) {
  return GhostButton(
    {
      className:
        "primary-text icon-btn " +
        className,

      onClick: () =>
        Router.navigate(route)
    },

    Icon({ name: icon }),

    ...children
  );
}