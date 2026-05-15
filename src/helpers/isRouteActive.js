export function isRouteActive(
  path,
  activeClass = "active"
) {
  const current = window.location.pathname;

  return current.startsWith(path)
    ? activeClass
    : "";
}