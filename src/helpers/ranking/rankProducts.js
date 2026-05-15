export function rankProducts(products = []) {
  return [...products].sort((a, b) => {
    const scoreA = getScore(a);
    const scoreB = getScore(b);
    
    return scoreB - scoreA;
  });
}

function getScore(product) {
  return (
    (product.views || 0) * 0.3 +
    (product.likes || 0) * 2 +
    (product.sold || 0) * 3 +
    (product.reviews || 0) * 1.5 +
    (product.rating || 0) * 5
  );
}