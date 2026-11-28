export function formatPeso(num: number, decimals = false): string {
  return '₱' + Number(num).toLocaleString('en-PH', {
    minimumFractionDigits: decimals ? 2 : 0,
    maximumFractionDigits: decimals ? 2 : 0,
  });
}

export function formatPesoFromCentavos(centavos: number, decimals = true): string {
  return formatPeso(centavos / 100, decimals);
}

export function toCentavos(peso: number): number {
  return Math.round(peso * 100);
}

export function validateAmount(peso: number): boolean {
  return Number.isFinite(peso) && peso > 0;
}
