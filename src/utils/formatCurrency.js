/**
 * Format number to Indonesian Rupiah currency string
 * @param {number|null} amount
 * @param {string} fallback - fallback string if amount is null
 * @returns {string}
 */
export function formatCurrency(amount, fallback = 'Hubungi Pemilik') {
  if (amount === null || amount === undefined) return fallback
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Format price range display
 * @param {number|null} min
 * @param {number|null} max
 * @returns {string}
 */
export function formatPriceRange(min, max) {
  if (!min && !max) return 'Hubungi Pemilik'
  if (!min) return `s/d ${formatCurrency(max)}`
  if (!max || min === max) return formatCurrency(min)
  return `${formatCurrency(min)} - ${formatCurrency(max)}`
}

/**
 * Short format for card display
 * @param {number|null} amount
 * @returns {string}
 */
export function formatCurrencyShort(amount) {
  if (amount === null || amount === undefined) return 'Hubungi Pemilik'
  if (amount >= 1_000_000) {
    return `Rp ${(amount / 1_000_000).toFixed(1).replace('.0', '')}jt/bln`
  }
  if (amount >= 1_000) {
    return `Rp ${(amount / 1_000).toFixed(0)}rb/bln`
  }
  return `Rp ${amount}/bln`
}
