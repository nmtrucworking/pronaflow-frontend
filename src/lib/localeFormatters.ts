type DateInput = Date | string | number;

type DateStyleOptions = Intl.DateTimeFormatOptions;

interface StoredPreferences {
  language?: string;
  timezone?: string;
}

const DEFAULT_LOCALE = 'en-US';

const readStoredPreferences = (): StoredPreferences => {
  if (typeof window === 'undefined') {
    return {};
  }

  try {
    const raw = localStorage.getItem('pronaflow-preferences');
    if (!raw) {
      return {};
    }
    return JSON.parse(raw) as StoredPreferences;
  } catch {
    return {};
  }
};

export const getActiveLocale = (): string => {
  if (typeof window === 'undefined') {
    return DEFAULT_LOCALE;
  }

  return localStorage.getItem('pronaflow-language') || readStoredPreferences().language || navigator.language || DEFAULT_LOCALE;
};

export const getActiveTimeZone = (): string | undefined => {
  return readStoredPreferences().timezone;
};

const toDate = (input: DateInput): Date => {
  if (input instanceof Date) {
    return input;
  }
  return new Date(input);
};

export const formatDate = (input: DateInput, options: DateStyleOptions = {}, locale?: string): string => {
  const date = toDate(input);
  if (Number.isNaN(date.getTime())) {
    return '--';
  }

  const activeLocale = locale || getActiveLocale();
  const activeTimeZone = getActiveTimeZone();

  return new Intl.DateTimeFormat(activeLocale, {
    ...(activeTimeZone ? { timeZone: activeTimeZone } : {}),
    ...options,
  }).format(date);
};

export const formatDateTime = (input: DateInput, options: DateStyleOptions = {}, locale?: string): string => {
  return formatDate(
    input,
    {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      ...options,
    },
    locale
  );
};

export const formatNumber = (value: number, options: Intl.NumberFormatOptions = {}, locale?: string): string => {
  return new Intl.NumberFormat(locale || getActiveLocale(), options).format(value);
};

export const formatCurrency = (
  value: number,
  currency: string,
  locale?: string,
  options: Intl.NumberFormatOptions = {}
): string => {
  return formatNumber(
    value,
    {
      style: 'currency',
      currency,
      ...options,
    },
    locale
  );
};
