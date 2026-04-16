import Input from "../Input.js";

export default function SearchBar() {
  function handleSearch(e) {
    
    if (e.key !== "Enter") return;

    const query = e.target.value.trim();

    if (!query) {
      window.router.navigate("/shop");
      return;
    }

    window.router.navigate(
      `/shop?search=${encodeURIComponent(query)}`
    );
  }

  return Input({
    type: "search",
    placeholder: "Search furniture...",
    className: "search-bar",
    onKeyDown: handleSearch
  });
}