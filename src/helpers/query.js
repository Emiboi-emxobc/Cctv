export function getQueryParams() {
  return Object.fromEntries(
    new URLSearchParams(window.location.search)
  );
}

export function setQueryParams(params = {}) {
  const query = new URLSearchParams(params);
  
  const url = `${window.location.pathname}?${query}`;
  
  window.history.replaceState({}, "", url);
}