const AUTH_KEY = 'car-rental-auth';

export const getStoredAuth = () => {
  try {
    return JSON.parse(localStorage.getItem(AUTH_KEY)) || null;
  } catch {
    return null;
  }
};

export const setStoredAuth = ({ user, token }) => {
  localStorage.setItem(AUTH_KEY, JSON.stringify({ user, token }));
};

export const clearStoredAuth = () => {
  localStorage.removeItem(AUTH_KEY);
};

export const getToken = () => getStoredAuth()?.token || null;
