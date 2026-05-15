export function groupProducts(
  items = [],
  key = "category"
) {
  return items.reduce((groups, item) => {
    const rawGroup = item[key] || "others";
    
    const group =
      rawGroup.charAt(0).toUpperCase() +
      rawGroup.slice(1);
    
    if (!groups[group]) {
      groups[group] = [];
    }
    
    groups[group].push(item);
    
    return groups;
  }, {});
}