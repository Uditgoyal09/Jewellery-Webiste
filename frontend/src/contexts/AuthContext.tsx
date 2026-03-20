import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  ApiError,
  apiFetchCurrentUser,
  apiLogin,
  apiRegister,
  apiUpdateProfile,
  clearAuthSession,
  getStoredUser,
  storeAuthSession,
  type AuthUser,
} from '@/lib/api';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null; user: AuthUser | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null; user: AuthUser | null }>;
  updateProfile: (payload: { fullName: string; phone?: string }) => Promise<{ error: Error | null; user: AuthUser | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(getStoredUser());
  const [loading, setLoading] = useState(true);
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const hydrateUser = async () => {
      try {
        const currentSession = await apiFetchCurrentUser();
        setUser(currentSession.user);
        storeAuthSession(currentSession.token, currentSession.user);
      } catch {
        clearAuthSession();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    hydrateUser();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await apiLogin({ email, password });
      storeAuthSession(response.token, response.user);
      setUser(response.user);
      return { error: null, user: response.user };
    } catch (error) {
      const message = error instanceof ApiError ? error.message : 'Unable to sign in.';
      return { error: new Error(message), user: null };
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const response = await apiRegister({ email, password, fullName });
      storeAuthSession(response.token, response.user);
      setUser(response.user);
      return { error: null, user: response.user };
    } catch (error) {
      const message = error instanceof ApiError ? error.message : 'Unable to create your account.';
      return { error: new Error(message), user: null };
    }
  };

  const signOut = async () => {
    clearAuthSession();
    setUser(null);
  };

  const updateProfile = async (payload: { fullName: string; phone?: string }) => {
    try {
      const response = await apiUpdateProfile(payload);
      storeAuthSession(response.token, response.user);
      setUser(response.user);
      return { error: null, user: response.user };
    } catch (error) {
      const message = error instanceof ApiError ? error.message : 'Unable to update your profile.';
      return { error: new Error(message), user: null };
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, signIn, signUp, updateProfile, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
