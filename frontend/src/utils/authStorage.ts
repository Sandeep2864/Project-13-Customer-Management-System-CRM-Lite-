import type { AuthUser } from "../types";

export const AUTH_STORAGE_KEYS = {
  token: "crm-lite-token",
  user: "crm-lite-user",
} as const;

const readStoredUser = (storage: Storage) => {
  const storedUser = storage.getItem(AUTH_STORAGE_KEYS.user);

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser) as AuthUser;
  } catch {
    storage.removeItem(AUTH_STORAGE_KEYS.user);
    return null;
  }
};

export const readStoredSession = () => {
  const persistentToken = localStorage.getItem(AUTH_STORAGE_KEYS.token);

  if (persistentToken) {
    return {
      token: persistentToken,
      user: readStoredUser(localStorage),
      remember: true,
    };
  }

  const sessionToken = sessionStorage.getItem(AUTH_STORAGE_KEYS.token);

  if (sessionToken) {
    return {
      token: sessionToken,
      user: readStoredUser(sessionStorage),
      remember: false,
    };
  }

  return {
    token: null,
    user: null,
    remember: true,
  };
};

export const persistSession = (
  token: string,
  user: AuthUser,
  remember: boolean
) => {
  clearStoredSession();

  const storage = remember ? localStorage : sessionStorage;
  storage.setItem(AUTH_STORAGE_KEYS.token, token);
  storage.setItem(AUTH_STORAGE_KEYS.user, JSON.stringify(user));
};

export const clearStoredSession = () => {
  localStorage.removeItem(AUTH_STORAGE_KEYS.token);
  localStorage.removeItem(AUTH_STORAGE_KEYS.user);
  sessionStorage.removeItem(AUTH_STORAGE_KEYS.token);
  sessionStorage.removeItem(AUTH_STORAGE_KEYS.user);
};

export const getStoredToken = () =>
  localStorage.getItem(AUTH_STORAGE_KEYS.token) ??
  sessionStorage.getItem(AUTH_STORAGE_KEYS.token);
