export function personalizeProducts(
  products,
  profile
) {
  return [...products].sort((a, b) => {
    const aInterest =
      profile.categories[a.category] || 0;

    const bInterest =
      profile.categories[b.category] || 0;

    return bInterest - aInterest;
  });
}