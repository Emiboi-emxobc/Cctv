import Div from "../Div.js";
import CategoryFilter from "./CategoryFilter.js";
import SortSelect from "./SortSelect.js";

export default function ShopControls({ query }) {
  return Div(
    { className: "shop-controls" },

    CategoryFilter({ query }),
    SortSelect({ query })
  );
}