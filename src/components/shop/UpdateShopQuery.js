export function updateShopQuery(
  query = {}
) {
  const cleaned = Object.fromEntries(
    Object.entries(query).filter(
      ([, value]) => value !== ""
    )
  );

  const params = new URLSearchParams(cleaned);

  window.router.navigate(
    `/shop?${params.toString()}`
  );
}