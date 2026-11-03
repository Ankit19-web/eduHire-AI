import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/index.ts';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, targetRole: string) => Promise<boolean>;
  logout: () => void;
  loginAsDemo: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => false,
  register: async () => false,
  logout: () => {},
  loginAsDemo: () => {},
});

const DEMO_USER: User = {
  id: 'user_demo_101',
  name: 'Alex Rivera',
  email: 'alex.dev@eduhire.ai',
  targetRole: 'Full Stack Java Engineer',
  experienceLevel: 'Mid-Level',
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('eduhire_token');
    const savedUser = localStorage.getItem('eduhire_user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch {
        // Fallback to demo user
        setToken('demo_token');
        setUser(DEMO_USER);
      }
    } else {
      // Pre-seed demo user session for instant accessibility
      setToken('demo_token');
      setUser(DEMO_USER);
      localStorage.setItem('eduhire_token', 'demo_token');
      localStorage.setItem('eduhire_user', JSON.stringify(DEMO_USER));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password?: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: password || 'password123' }),
      });
      const data = await res.json();
      if (res.ok && data.token && data.user) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('eduhire_token', data.token);
        localStorage.setItem('eduhire_user', JSON.stringify(data.user));
        return true;
      }
    } catch (err) {
      console.error('Login error:', err);
    }
    return false;
  };

  const register = async (name: string, email: string, password: string, targetRole: string) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, targetRole }),
      });
      const data = await res.json();
      if (res.ok && data.token && data.user) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('eduhire_token', data.token);
        localStorage.setItem('eduhire_user', JSON.stringify(data.user));
        return true;
      }
    } catch (err) {
      console.error('Register error:', err);
    }
    return false;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('eduhire_token');
    localStorage.removeItem('eduhire_user');
  };

  const loginAsDemo = () => {
    setToken('demo_token');
    setUser(DEMO_USER);
    localStorage.setItem('eduhire_token', 'demo_token');
    localStorage.setItem('eduhire_user', JSON.stringify(DEMO_USER));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        loginAsDemo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
