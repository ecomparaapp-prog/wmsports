import { useState, useEffect, useCallback } from 'react';

export interface AuthUser {
  id: number;
  googleId: string;
  email: string;
  name: string;
  avatar: string | null;
  fullName: string | null;
  address: string | null;
  phone: string | null;
}

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
}

let globalState: AuthState = { user: null, loading: true };
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach(fn => fn());
}

async function fetchMe() {
  try {
    const res = await fetch('/api/auth/me', { credentials: 'include' });
    if (res.ok) {
      const data = await res.json();
      globalState = { user: data.user ?? null, loading: false };
    } else {
      globalState = { user: null, loading: false };
    }
  } catch {
    globalState = { user: null, loading: false };
  }
  notify();
}

// Kick off on module load
fetchMe();

export function useAuth() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const rerender = () => setTick(t => t + 1);
    listeners.add(rerender);
    return () => { listeners.delete(rerender); };
  }, []);

  const logout = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    globalState = { user: null, loading: false };
    notify();
  }, []);

  const updateProfile = useCallback(async (data: { fullName?: string; address?: string; phone?: string }) => {
    const res = await fetch('/api/auth/profile', {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const json = await res.json();
      globalState = { user: json.user, loading: false };
      notify();
      return json.user;
    }
    throw new Error('Failed to update profile');
  }, []);

  return {
    user: globalState.user,
    loading: globalState.loading,
    logout,
    updateProfile,
    refetch: fetchMe,
  };
}
