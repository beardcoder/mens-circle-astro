/**
 * Format a date for display
 * @param dateString - ISO date string (YYYY-MM-DD)
 * @param locale - Locale for formatting (default: 'de-DE')
 */
export function formatDate(dateString: string, locale = "de-DE"): string {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Extract day, month, and year from a date string
 */
export function getDateParts(dateString: string, locale = "de-DE") {
  const date = new Date(dateString);
  return {
    day: date.getUTCDate().toString().padStart(2, "0"),
    month: date.toLocaleString(locale, { month: "long" }),
    year: date.getUTCFullYear(),
    time: date.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" }),
  };
}
