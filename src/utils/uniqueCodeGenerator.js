/**
 * Generates a unique code for listings
 * Format: WR-[random alphanumeric]-[timestamp fragment]
 *
 * @returns {string} A unique code suitable for listing identification
 */
export const generateUniqueListingCode = () => {
  // Get random alphanumeric string (6 characters)
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();

  // Get timestamp part (using last 4 digits of current timestamp)
  const timestampPart = Date.now().toString().slice(-4);

  // Combine with prefix
  return `WR-${randomPart}-${timestampPart}`;
};

/**
 * Validates if a code appears to be in the correct format
 *
 * @param {string} code The code to validate
 * @returns {boolean} Whether the code is valid
 */
export const isValidListingCode = (code) => {
  if (!code) return false;

  // Basic format check: WR-XXXXXX-XXXX
  const codePattern = /^WR-[A-Z0-9]{6}-\d{4}$/;
  return codePattern.test(code);
};
