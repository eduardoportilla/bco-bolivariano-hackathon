/**
 * API endpoint constants.
 * Centralized endpoint definitions for consistency across web and mobile.
 */
export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    me: '/auth/me',
    register: '/auth/register',
  },
  accounts: {
    list: '/accounts',
    detail: (id: string) => `/accounts/${id}`,
    balance: (id: string) => `/accounts/${id}/balance`,
    transactions: (id: string) => `/accounts/${id}/transactions`,
  },
  transfers: {
    create: '/transfers',
    list: '/transfers',
    detail: (id: string) => `/transfers/${id}`,
    cancel: (id: string) => `/transfers/${id}/cancel`,
  },
  contacts: {
    list: '/contacts',
    detail: (id: string) => `/contacts/${id}`,
    create: '/contacts',
    delete: (id: string) => `/contacts/${id}`,
  },
} as const;
