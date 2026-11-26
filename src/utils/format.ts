export function formatPeso(num: number, decimals = false): string {
  return '₱' + Number(num).toLocaleString('en-PH', {
    minimumFractionDigits: decimals ? 2 : 0,
    maximumFractionDigits: decimals ? 2 : 0,
  });
}
