import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendEmailVerification
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  year: string;
  concentration: string;
  dorm: string;
  interests: string[];
  instagramHandle: string;
  profilePictureUrl: string;
  createdAt: Date;
  lastActiveAt: Date;
}

interface AuthContextType {
  user: User | null;
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
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (uid: string) => {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      const data = userDoc.data();
      setUserProfile({
        id: uid,
        name: data.name || '',
        email: data.email || '',
        year: data.year || '',
        concentration: data.concentration || '',
        dorm: data.dorm || '',
        interests: data.interests || [],
        instagramHandle: data.instagramHandle || '',
        profilePictureUrl: data.profilePictureUrl || '',
        createdAt: data.createdAt?.toDate() || new Date(),
        lastActiveAt: data.lastActiveAt?.toDate() || new Date(),
      });
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchUserProfile(user.uid);
    }
  };

  useEffect(() => {
    try {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        console.log("Auth state changed:", user?.email);
        setUser(user);
        if (user) {
          try {
            await fetchUserProfile(user.uid);
          } catch (error) {
            console.error("Error fetching profile:", error);
          }
        } else {
          setUserProfile(null);
        }
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error("Error setting up auth listener:", error);
      setLoading(false);
    }
  }, []);

  const isHarvardEmail = (email: string) => {
    return email.endsWith('@college.harvard.edu') || email.endsWith('@harvard.edu');
  };

  const signIn = async (email: string, password: string) => {
    if (!isHarvardEmail(email)) {
      throw new Error('Please use a Harvard email address (@college.harvard.edu or @harvard.edu)');
    }
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (email: string, password: string, name: string) => {
    if (!isHarvardEmail(email)) {
      throw new Error('Please use a Harvard email address (@college.harvard.edu or @harvard.edu)');
    }
    
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const newUser = userCredential.user;
    
    // Create user document in Firestore
    await setDoc(doc(db, 'users', newUser.uid), {
      name,
      email,
      year: '',
      concentration: '',
      dorm: '',
      interests: [],
      instagramHandle: '',
      profilePictureUrl: '',
      createdAt: serverTimestamp(),
      lastActiveAt: serverTimestamp(),
    });

    // Send email verification
    await sendEmailVerification(newUser);
  };

  const logout = async () => {
    await signOut(auth);
    setUserProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, signIn, signUp, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
