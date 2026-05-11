export function filterProducts(
  products = [],
  {
    category = "all",
    search = "",
    sort = "default"
  } = {}
) {
  let result = [...products];
  
  if (category !== "all") {
    result = result.filter(
      item => item.category === category
    );
  }
  
  if (search) {
    result = result.filter(product => {
      const text = `
        ${product.name}
        ${product.description}
        ${product.category}
        ${product.subCategory}
        ${product.tags?.join(" ")}
      `.toLowerCase();
      
      return text.includes(search.toLowerCase());
    });
  }
  
  switch (sort) {
    case "low-price":
      result.sort((a, b) => a.promo - b.promo);
      break;
      
    case "high-price":
      result.sort((a, b) => b.promo - a.promo);
      break;
      
    case "rating":
      result.sort((a, b) => b.rating - a.rating);
      break;
      
    case "newest":
      result.sort(
        (a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      break;
      
    case "popular":
      result.sort((a, b) => b.likes - a.likes);
      break;
  }
  
  return result;
}