import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authApi, UserProfile, getAuthToken } from '@/lib/api';

interface AuthContextType {
  user: { id: string; email: string } | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async () => {
    try {
      const profile = await authApi.getMe();
      if (profile) {
        setUser({ id: profile.id, email: profile.email });
        setUserProfile(profile);
      } else {
        setUser(null);
        setUserProfile(null);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      setUser(null);
      setUserProfile(null);
    }
  };

  const refreshProfile = async () => {
    await fetchUserProfile();
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check if we have a stored token
        const token = getAuthToken();
        if (token) {
          await fetchUserProfile();
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const isHarvardEmail = (email: string) => {
    return email.endsWith('@college.harvard.edu') || email.endsWith('@harvard.edu');
  };

  const signIn = async (email: string, password: string) => {
    if (!isHarvardEmail(email)) {
      throw new Error('Please use a Harvard email address (@college.harvard.edu or @harvard.edu)');
    }
    
    const result = await authApi.login(email, password);
    setUser(result.user);
    await fetchUserProfile();
  };

  const signUp = async (email: string, password: string, name: string) => {
    if (!isHarvardEmail(email)) {
      throw new Error('Please use a Harvard email address (@college.harvard.edu or @harvard.edu)');
    }
    
    const result = await authApi.signup(email, password, name);
    setUser(result.user);
    await fetchUserProfile();
  };

  const logout = async () => {
    authApi.logout();
    setUser(null);
    setUserProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, signIn, signUp, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
