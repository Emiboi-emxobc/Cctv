import { get, set } from "../helpers.js";

export const ui = {
  /* =====================
     MENU
  ===================== */
  openMenu() {
    set("ui.menuOpen", true);
  },
  
  closeMenu() {
    set("ui.menuOpen", false);
  },
  
  toggleMenu() {
    set(
      "ui.menuOpen",
      !get("ui.menuOpen")
    );
  },
  
  /* =====================
     LOADING
  ===================== */
  setLoading(
    status = false
  ) {
    set(
      "ui.loading",
      status
    );
  },
  
  isLoading() {
    return get(
      "ui.loading"
    );
  },
  
  /* =====================
     SEARCH
  ===================== */
  setSearchQuery(
    query = ""
  ) {
    set(
      "ui.searchQuery",
      query
    );
  },
  
  getSearchQuery() {
    return (
      get(
        "ui.searchQuery"
      ) || ""
    );
  },
  
  setSearchResults(
    results = []
  ) {
    set(
      "ui.searchResults",
      results
    );
  },
  
  getSearchResults() {
    return (
      get(
        "ui.searchResults"
      ) || []
    );
  },
  
  clearSearch() {
    set(
      "ui.searchQuery",
      ""
    );
    set(
      "ui.searchResults",
      []
    );
  },
  
  /* =====================
     IMAGE PREVIEW
  ===================== */
  previewImage(
    key,
    src = null
  ) {
    set(
      `ui.previewImage.${key}`,
      src
    );
  },
  
  clearPreviewImage(
    key
  ) {
    set(
      `ui.previewImage.${key}`,
      null
    );
  },
  
  getPreviewImage(
    key
  ) {
    return get(
      `ui.previewImage.${key}`
    );
  }
};