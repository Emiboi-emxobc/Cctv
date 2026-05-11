export function formatPrice(
  amount = 0,
  currency = "NGN",
  locale = "en-NG"
) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency
  }).format(amount);
  
/*export function formatPrice(amount = 0) {
  return `₦${Number(amount).toLocaleString()}`;
}*/
}