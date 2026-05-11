import Button from "./Button.js";
import Icon from "../icons/Icon.js";

export default function BackButton({
   onClick = () => history.back()
} = {}) {
   return Button(
      {
         className: "back-button",
         onClick
      },
      Icon({ name: "arrow-left" })
   );
}