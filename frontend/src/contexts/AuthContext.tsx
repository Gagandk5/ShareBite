import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '../types';
import { apiFetch } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  registerUser: (userData: any) => Promise<User>;
  logout: () => void;
  quickDemoLogin: (role: Role) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('sharebite_token'));
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadUser() {
      if (token) {
        try {
          const res = await apiFetch<{ user: User }>('/auth/me');
          setUser(res.user);
        } catch (err) {
          console.error('Failed to load user session:', err);
          logout();
        }
      }
      setLoading(false);
    }
    loadUser();
  }, [token]);

  const login = async (email: string, password: string): Promise<User> => {
    const res = await apiFetch<{ token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    localStorage.setItem('sharebite_token', res.token);
    setToken(res.token);
    setUser(res.user);
    return res.user;
  };

  const registerUser = async (userData: any): Promise<User> => {
    const res = await apiFetch<{ token: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    localStorage.setItem('sharebite_token', res.token);
    setToken(res.token);
    setUser(res.user);
    return res.user;
  };

  const logout = () => {
    localStorage.removeItem('sharebite_token');
    setToken(null);
    setUser(null);
  };

  const quickDemoLogin = async (role?: Role) => {
    const roleEmailMap: Record<string, string> = {
      USER: 'demo@example.com',
      DONOR: 'donor@example.com',
      RECIPIENT: 'recipient@example.com',
      VOLUNTEER: 'volunteer@example.com'
    };
    const targetEmail = role ? roleEmailMap[role] || 'demo@example.com' : 'demo@example.com';
    await login(targetEmail, 'Password123!');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        registerUser,
        logout,
        quickDemoLogin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
