export function formatIQD(amount?: number) {
  try { return new Intl.NumberFormat("ar-IQ").format(amount || 0) + " IQD"; }
  catch { return `${amount} IQD`; }
}
