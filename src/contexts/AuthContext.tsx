import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { User, LoginCredentials, SignupData } from '@/lib/types';
import { authApi, usersApi } from '@/lib/api';

/**
 * Authentication context type definition
 * Provides user state and authentication methods throughout the app
 */
interface AuthContextType {
  /** Current authenticated user or null if not logged in */
  user: User | null;
  /** Boolean indicating if a user is currently authenticated */
  isAuthenticated: boolean;
  /** Loading state during initial session restoration */
  isLoading: boolean;
  /** Login function accepting email and password */
  login: (credentials: LoginCredentials) => Promise<void>;
  /** Signup function for new user registration */
  signup: (data: SignupData) => Promise<void>;
  /** Logout function to clear user session */
  logout: () => void;
  /** Update user profile information */
  updateProfile: (data: Partial<User>) => Promise<void>;
}

// Create the authentication context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider component
 * Manages authentication state and provides auth methods to the entire app
 *
 * Features:
 * - Automatic session restoration on app load
 * - User login/signup/logout functionality
 * - Profile update management
 * - Loading state during initialization
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore user session on app initialization
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Attempt to retrieve existing user session from storage/cookies
        const existingUser = await authApi.getCurrentUser();
        if (existingUser) {
          setUser(existingUser);
        }
      } catch (error) {
        console.error('Failed to restore session:', error);
      } finally {
        // Always mark loading as complete, even if restoration fails
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  /**
   * Login user with email and password
   * Updates user state on successful authentication
   */
  const login = async (credentials: LoginCredentials) => {
    const authUser = await authApi.login(credentials);
    setUser(authUser);
  };

  /**
   * Register new user account
   * Automatically logs in user after successful signup
   */
  const signup = async (data: SignupData) => {
    const authUser = await authApi.signup(data);
    setUser(authUser);
  };

  /**
   * Logout current user
   * Clears user state and removes session data
   */
  const logout = () => {
    authApi.logout();
    setUser(null);
  };

  /**
   * Update current user's profile information
   * Merges partial updates with existing user data
   */
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

/**
 * useAuth hook
 * Access authentication context from any component
 *
 * @throws Error if used outside of AuthProvider
 * @returns AuthContextType with user state and auth methods
 *
 * @example
 * const { user, isAuthenticated, login, logout } = useAuth();
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
