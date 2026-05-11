import Text from "./Text.js";
import { formatPrice } from "../../helpers/formatPrice.js";

export default function Price({
  amount = 0,
  className = ""
} = {}) {
  return Text(
    {
      className: `price ${className}`.trim()
    },
    formatPrice(amount)
  );
}