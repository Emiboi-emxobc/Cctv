import Div from "../Div.js";
import Input from "../form/Input.js";

import SearchSuggestion from "./SearchSuggestion.js";
import { Store } from "../../store/index.js";

import { getProducts } from "../../data/products/index.js";
import { setQueryParams } from "../../helpers/query.js";

export default function SearchBar() {
  function handleInput(e) {
    const query = e.target.value.trim();

    Store.set("ui.searchQuery", query);

    setQueryParams({ search: query });

    if (!query) {
      Store.set("ui.searchResults", []);
      return;
    }

    const results = getProducts().filter(product =>
      product.name.toLowerCase().includes(
        query.toLowerCase()
      )
    );

    Store.set("ui.searchResults", results.slice(0, 5));
  }

  return Div(
    { className: "search-bar" },

    Input({
      placeholder: "Search products...",
      onInput: handleInput,
      className:"search-input"
    }),

    SearchSuggestion()
  );
}