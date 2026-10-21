/**
 * Formats an Ethiopian phone number from raw format (e.g., '0911948627')
 * into human-readable spaced format (e.g., '0911 948 627').
 */
export function formatPhone(phone: string): string {
  const clean = phone.replace(/\D/g, '');
  if (clean.length === 10 && clean.startsWith('09')) {
    return `${clean.slice(0, 4)} ${clean.slice(4, 7)} ${clean.slice(7)}`;
  }
  if (clean.length === 12 && clean.startsWith('2519')) {
    return `+251 ${clean.slice(3, 5)} ${clean.slice(5, 8)} ${clean.slice(8)}`;
  }
  return phone;
}

/**
 * Converts a stored Ethiopian phone number (e.g., '0911948627')
 * to standard RFC 3966 international tel URI (e.g., 'tel:+251911948627').
 */
export function toTel(phone: string): string {
  const clean = phone.replace(/\D/g, '');
  if (clean.startsWith('09') && clean.length === 10) {
    return `tel:+251${clean.slice(1)}`;
  }
  if (clean.startsWith('251') && clean.length === 12) {
    return `tel:+${clean}`;
  }
  return `tel:${phone}`;
}
