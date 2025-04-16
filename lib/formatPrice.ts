export function formatPrice(price: number): string {
  return price.toLocaleString("es-CO", {
    style: "decimal",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  });
}
