const EMAIL_PATTERN = /^[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+@(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,63}$/i;
const PERSON_NAME_PATTERN = /^\p{L}[\p{L}\p{M}]*(?:\s+\p{L}[\p{L}\p{M}]*)*$/u;

export function isValidPersonName(name) {
  const normalized = String(name || '').trim();
  return normalized.length >= 2 && PERSON_NAME_PATTERN.test(normalized);
}

export function isValidIndianMobile(phone) {
  return /^[6-9]\d{9}$/.test(String(phone || '').trim());
}

export function isValidReportEmail(email) {
  const normalized = String(email || '').trim();
  const atIndex = normalized.lastIndexOf('@');
  return normalized.length <= 254 &&
    atIndex > 0 &&
    atIndex <= 64 &&
    normalized[0] !== '.' &&
    normalized[atIndex - 1] !== '.' &&
    !normalized.slice(0, atIndex).includes('..') &&
    EMAIL_PATTERN.test(normalized);
}
