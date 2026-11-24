export function formatRupiah(amount: number): string {
  const safeInt = Math.round(Number(amount) || 0);
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0
  }).format(safeInt);
}

export function cleanRupiahInput(value: string): number {
  const clean = value.replace(/[^0-9]/g, '');
  if (!clean) return 0;
  const parsed = parseInt(clean, 10);
  return Number.isNaN(parsed) ? 0 : parsed;
}
