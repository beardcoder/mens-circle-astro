/**
 * Format a date for display
 * @param dateString - ISO date string (YYYY-MM-DD)
 * @param locale - Locale for formatting (default: 'de-DE')
 */
export function formatDate(dateString: string, locale = "de-DE"): string {
  const date = new Date(`${dateString}T00:00:00`);
  return date.toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

/**
 * Extract day, month, and year from a date string
 */
export function getDateParts(dateString: string) {
  const date = new Date(`${dateString}T00:00:00`);
  return {
    day: date.getUTCDate().toString().padStart(2, "0"),
    month: date.toLocaleString("en-US", { month: "long", timeZone: "UTC" }),
    year: date.getUTCFullYear(),
  };
}
