/**
 * Generate WhatsApp click-to-chat link
 * @param {string} phone - phone number (may include +62 or 0)
 * @param {string} propertyName - name of kos
 * @returns {string} WhatsApp URL
 */
export function generateWhatsAppLink(phone, propertyName = '') {
  if (!phone) return null
  
  // Clean phone number: remove spaces, dashes, parentheses
  let cleaned = phone.replace(/[\s\-\(\)]/g, '')
  
  // Convert leading 0 to +62 (Indonesia)
  if (cleaned.startsWith('0')) {
    cleaned = '+62' + cleaned.slice(1)
  }
  
  // Ensure it starts with + or 62
  if (!cleaned.startsWith('+') && !cleaned.startsWith('62')) {
    cleaned = '+62' + cleaned
  }
  
  // Remove + for wa.me format
  const number = cleaned.replace('+', '')
  
  const message = propertyName
    ? `Halo, saya tertarik untuk menyewa kamar di ${propertyName}. Apakah kamar masih tersedia?`
    : 'Halo, saya tertarik untuk menyewa kamar. Apakah kamar masih tersedia?'
  
  const encodedMessage = encodeURIComponent(message)
  
  return `https://wa.me/${number}?text=${encodedMessage}`
}

/**
 * Format phone for display
 * @param {string} phone
 * @returns {string}
 */
export function formatPhone(phone) {
  if (!phone) return '-'
  let cleaned = phone.replace(/[\s\-\(\)]/g, '')
  if (cleaned.startsWith('+62')) {
    cleaned = '0' + cleaned.slice(3)
  } else if (cleaned.startsWith('62')) {
    cleaned = '0' + cleaned.slice(2)
  }
  // Format: 0812-3456-7890
  if (cleaned.length === 12) {
    return `${cleaned.slice(0,4)}-${cleaned.slice(4,8)}-${cleaned.slice(8,12)}`
  }
  if (cleaned.length === 11) {
    return `${cleaned.slice(0,4)}-${cleaned.slice(4,8)}-${cleaned.slice(8,11)}`
  }
  return cleaned
}
