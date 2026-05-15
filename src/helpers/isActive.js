export function isActive(
  value,
  current,
  activeClass = "active"
) {
  if (Array.isArray(value)) {
    return value.includes(current)
      ? activeClass
      : "";
  }

  return value === current
    ? activeClass
    : "";
}