import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User, LoginCredentials, SignupData } from '@/lib/types';
import { authApi, usersApi } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Clear any existing session on app start so users always see the landing page first
    authApi.logout();
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const authUser = await authApi.login(credentials);
    setUser(authUser);
  };

  const signup = async (data: SignupData) => {
    const authUser = await authApi.signup(data);
    setUser(authUser);
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
  };

  const updateProfile = async (data: Partial<User>) => {
    const updated = await usersApi.updateProfile(data);
    setUser(updated);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      signup,
      logout,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
