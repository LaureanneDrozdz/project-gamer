export const parseToDate = (
  input?: string | number | Date | null
): Date | null => {
  if (input === undefined || input === null) return null;
  try {
  const d = input instanceof Date ? input : new Date(input);
    if (isNaN(d.getTime())) return null;
    return d;
  } catch (e) {
    return null;
  }
};

export const formatDate = (
  input?: string | number | Date | null,
  options?: Intl.DateTimeFormatOptions,
  locale = 'fr-FR',
  fallback = 'date inconnue'
): string => {
  const d = parseToDate(input);
  if (!d) return fallback;
  return new Intl.DateTimeFormat(locale, options).format(d);
};

export default formatDate;
