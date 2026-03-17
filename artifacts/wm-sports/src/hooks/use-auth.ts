import { useState, useEffect, useCallback } from 'react';

export interface AuthUser {
  name: string;
  email: string;
  address: string;
  phone: string;
}

const STORAGE_KEY = 'wm-sports-profile';

function loadUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthUser;
    if (!parsed.name) return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveUser(user: AuthUser) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

function clearUser() {
  localStorage.removeItem(STORAGE_KEY);
}

let globalUser: AuthUser | null = loadUser();
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach(fn => fn());
}

export function useAuth() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const rerender = () => setTick(t => t + 1);
    listeners.add(rerender);
    return () => { listeners.delete(rerender); };
  }, []);

  const login = useCallback((user: AuthUser) => {
    saveUser(user);
    globalUser = user;
    notify();
  }, []);

  const logout = useCallback(() => {
    clearUser();
    globalUser = null;
    notify();
  }, []);

  const updateProfile = useCallback((data: Partial<AuthUser>) => {
    const updated = { ...globalUser, ...data } as AuthUser;
    saveUser(updated);
    globalUser = updated;
    notify();
    return updated;
  }, []);

  return {
    user: globalUser,
    loading: false,
    login,
    logout,
    updateProfile,
  };
}
