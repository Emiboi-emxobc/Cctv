import Div from "../Div.js";
import Button from "../buttons/Button.js";
import { updateShopQuery } from "../../helpers/UpdateShopQuery.js";
import { isActive } from "../../helpers/isActive.js";

const categories = [
  "all",
  "sofas",
  "chairs",
  "desks",
  "beds",
  "tables"
];

export default function CategoryFilter({
  query = {}
}) {
  const active = query.category || "all";

  return Div(
    { className: "shop-categories" },

    ...categories.map(category =>
      Button(
        {
          className: `shop-category-btn ${isActive(
            category,
            active
          )}`,
          onClick: () =>
            updateShopQuery({
              ...query,
              category:
                category === "all"
                  ? ""
                  : category
            })
        },
        category
      )
    )
  );
}