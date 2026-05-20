const SUPPORTED_LOCALES = {
  en: {
    code: 'en', prefix: '', label: 'English', dir: 'ltr',
  },
  zh: {
    code: 'zh', prefix: '/zh', label: '中文', dir: 'ltr',
  },
};

/**
 * Gets the current locale from the URL path.
 * @returns {object} The locale object
 */
export function getCurrentLocale() {
  const { pathname } = window.location;
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length > 0 && SUPPORTED_LOCALES[segments[0]]) {
    return SUPPORTED_LOCALES[segments[0]];
  }
  return SUPPORTED_LOCALES.en;
}

/**
 * Gets the locale prefix for building paths.
 * @returns {string} The locale prefix (e.g., '/zh' or '')
 */
export function getLocalePrefix() {
  return getCurrentLocale().prefix;
}

/**
 * Returns supported locales.
 * @returns {object} The supported locales map
 */
export function getSupportedLocales() {
  return SUPPORTED_LOCALES;
}
