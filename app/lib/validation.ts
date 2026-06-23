export function validatePhone(phone: string): boolean {
  if (!phone) return false;
  const trimmed = phone.trim();
  
  // 1. Ensure it only contains digits, spaces, dashes, parentheses, and optional leading +
  const allowedCharsRegex = /^\+?[0-9\s\-()]+$/;
  if (!allowedCharsRegex.test(trimmed)) {
    return false;
  }
  
  // 2. Remove all formatting characters to get just digits
  const digits = trimmed.replace(/\D/g, '');
  
  // 3. Ensure number of digits is between 10 and 15 (E.164 standard)
  return digits.length >= 10 && digits.length <= 15;
}
