import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as loginService, logout as logoutService, getCurrentUser, getToken } from './services/authService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Al montar, cargar usuario y token
    const loadAuth = async () => {
      const t = await getToken();
      const u = await getCurrentUser();
      setToken(t);
      setUser(u);
      setLoading(false);
    };
    loadAuth();
  }, []);

  const login = async (nick, password) => {
    const data = await loginService(nick, password);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const logout = async () => {
    await logoutService();
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, token, loading, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 