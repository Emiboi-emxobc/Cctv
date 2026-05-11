import Div from "../Div.js";
import Paragraph from "../typography/Paragraph.js";
import ProductSuggestion from "./ProductSuggestion.js";
import { reactive } from "../../helpers/reactive.js";

export default function SearchSuggestions() {
  return reactive("ui.searchResults", (results = []) => {
    if (!results.length) return null;

    return Div(
      { className: "search-suggestions" },

      ...results.map(result =>
        ProductSuggestion(result)
      )
    );
  });
}