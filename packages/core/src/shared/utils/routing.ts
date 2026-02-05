/**
 * Convert a Vite BASE_URL into a React Router basename.
 *
 * Vite's `import.meta.env.BASE_URL` always includes a trailing slash
 * (e.g. "/_mfe/accounts/"), but React Router's `basename` requires
 * no trailing slash (e.g. "/_mfe/accounts").
 *
 * Also handles empty, undefined, or root-only values gracefully.
 *
 * @param baseUrl - The value from `import.meta.env.BASE_URL` or similar source.
 * @returns A normalized basename suitable for React Router's BrowserRouter.
 *
 * @example
 * getRouterBasename('/_mfe/accounts/') // "/_mfe/accounts"
 * getRouterBasename('/')               // ""
 * getRouterBasename('')                // ""
 * getRouterBasename(undefined)         // ""
 */
export function getRouterBasename(baseUrl?: string): string {
  if (!baseUrl) {
    return '';
  }

  const trimmed = baseUrl.replace(/\/+$/, '');

  return trimmed;
}
