import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import api from '../config/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // checking stored token on startup

  // ── On app launch: restore session ──────────────────────────────────────
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync('auth_token');
        if (storedToken) {
          setToken(storedToken);
          const res = await api.get('/api/users/me');
          setUser(res.data);
        }
      } catch (_) {
        // Token invalid/expired — clear it
        await SecureStore.deleteItemAsync('auth_token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    restoreSession();
  }, []);

  // ── Login ────────────────────────────────────────────────────────────────
  const login = async (email, password) => {
    const res = await api.post('/api/auth/login', { email, password });
    const { token: newToken, user: newUser } = res.data;
    await SecureStore.setItemAsync('auth_token', newToken);
    setToken(newToken);
    setUser(newUser);
    return newUser;
  };

  // ── Register ─────────────────────────────────────────────────────────────
  const register = async (name, email, password) => {
    const res = await api.post('/api/auth/register', { name, email, password });
    return res.data;
  };

  // ── Logout ───────────────────────────────────────────────────────────────
  const logout = async () => {
    await SecureStore.deleteItemAsync('auth_token');
    setToken(null);
    setUser(null);
  };

  // ── Refresh user profile ─────────────────────────────────────────────────
  const refreshUser = async () => {
    const res = await api.get('/api/users/me');
    setUser(res.data);
    return res.data;
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
