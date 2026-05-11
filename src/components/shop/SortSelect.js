import Select from "../form/Select.js";
import Div from "../Div.js";
import { updateShopQuery } from "../../helpers/UpdateShopQuery.js";

export default function SortSelect({
  query = {}
}) {
  return Div(
    { className: "shop-sort" },

    Select({
      className: "shop-sort-select",
      value: query.sort || "default",

      options: [
        { value: "default", label: "Sort By" },
        { value: "low-price", label: "Lowest Price" },
        { value: "high-price", label: "Highest Price" },
        { value: "rating", label: "Top Rated" },
        { value: "popular", label: "Most Popular" },
        { value: "newest", label: "New Arrivals" }
      ],

      onChange: e =>
        updateShopQuery({
          ...query,
          sort: e.target.value
        })
    })
  );
}