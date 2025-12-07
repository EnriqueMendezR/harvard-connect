// API client for communicating with the backend
// Falls back to mock data when backend is unavailable (for Lovable preview)

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Token management
let authToken: string | null = localStorage.getItem('auth_token');

export const setAuthToken = (token: string | null) => {
  authToken = token;
  if (token) {
    localStorage.setItem('auth_token', token);
  } else {
    localStorage.removeItem('auth_token');
  }
};

export const getAuthToken = () => authToken;

// Check if running in Lovable preview (backend not available)
let isBackendAvailable: boolean | null = null;

const checkBackendAvailability = async (): Promise<boolean> => {
  if (isBackendAvailable !== null) return isBackendAvailable;
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(2000),
    });
    isBackendAvailable = response.ok;
  } catch {
    isBackendAvailable = false;
  }
  
  return isBackendAvailable;
};

// Generic fetch wrapper
const apiFetch = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (authToken) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${authToken}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
};

// ============ AUTH API ============

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface UserProfile extends User {
  year: string;
  concentration: string;
  dorm: string;
  interests: string[];
  instagramHandle: string;
  profilePictureUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export const authApi = {
  async signup(email: string, password: string, name: string): Promise<AuthResponse> {
    const backendUp = await checkBackendAvailability();
    if (!backendUp) {
      // Mock signup for preview
      const mockUser = {
        id: 'mock-user-' + Date.now(),
        name,
        email,
      };
      const mockToken = 'mock-token-' + Date.now();
      setAuthToken(mockToken);
      localStorage.setItem('mock_user', JSON.stringify(mockUser));
      return { token: mockToken, user: mockUser };
    }
    
    const result = await apiFetch<AuthResponse>('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
    setAuthToken(result.token);
    return result;
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const backendUp = await checkBackendAvailability();
    if (!backendUp) {
      // Mock login for preview
      const mockUser = {
        id: 'mock-user-' + Date.now(),
        name: email.split('@')[0],
        email,
      };
      const mockToken = 'mock-token-' + Date.now();
      setAuthToken(mockToken);
      localStorage.setItem('mock_user', JSON.stringify(mockUser));
      return { token: mockToken, user: mockUser };
    }
    
    const result = await apiFetch<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setAuthToken(result.token);
    return result;
  },

  async getMe(): Promise<UserProfile | null> {
    const backendUp = await checkBackendAvailability();
    if (!backendUp) {
      // Return mock user from localStorage
      const mockUser = localStorage.getItem('mock_user');
      if (mockUser && authToken) {
        const user = JSON.parse(mockUser);
        return {
          ...user,
          year: '',
          concentration: '',
          dorm: '',
          interests: [],
          instagramHandle: '',
          profilePictureUrl: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      }
      return null;
    }
    
    if (!authToken) return null;
    
    try {
      return await apiFetch<UserProfile>('/api/me');
    } catch {
      return null;
    }
  },

  async updateProfile(data: Partial<UserProfile>): Promise<UserProfile> {
    const backendUp = await checkBackendAvailability();
    if (!backendUp) {
      // Mock update for preview
      const mockUser = localStorage.getItem('mock_user');
      const updated = {
        ...(mockUser ? JSON.parse(mockUser) : {}),
        ...data,
      };
      localStorage.setItem('mock_user', JSON.stringify(updated));
      return updated as UserProfile;
    }
    
    return apiFetch<UserProfile>('/api/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  logout() {
    setAuthToken(null);
    localStorage.removeItem('mock_user');
  },
};

// ============ ACTIVITIES API ============

export interface Activity {
  id: string;
  title: string;
  category: string;
  description: string;
  location: string;
  datetime: string;
  maxSize: number;
  participantCount: number;
  organizer: {
    id: string;
    name: string;
    profilePictureUrl?: string;
  };
  createdAt?: string;
  isCancelled?: boolean;
}

export interface ActivityDetail extends Activity {
  participants: Array<{
    id: string;
    name: string;
    profilePictureUrl?: string;
  }>;
  hasJoined: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderPicture?: string;
  content: string;
  createdAt: string;
}

// Mock data for when backend is unavailable
const mockActivities: Activity[] = [
  {
    id: "1",
    title: "CS50 Problem Set Study Session",
    category: "study",
    description: "Working through this week's problem set together. All skill levels welcome - we can help each other out!",
    location: "Lamont Library, B Level",
    datetime: "2024-12-08T14:00:00",
    maxSize: 6,
    participantCount: 4,
    organizer: { id: "u1", name: "Sarah Chen", profilePictureUrl: "" }
  },
  {
    id: "2",
    title: "Sunday Brunch at Annenberg",
    category: "meal",
    description: "Let's grab brunch together! Perfect for meeting new people in a chill setting.",
    location: "Annenberg Hall",
    datetime: "2024-12-08T11:00:00",
    maxSize: 8,
    participantCount: 3,
    organizer: { id: "u2", name: "Marcus Johnson" }
  },
  {
    id: "3",
    title: "Pickup Basketball @ MAC",
    category: "sports",
    description: "Casual 5v5 games. All skill levels welcome - just come ready to have fun!",
    location: "Malkin Athletic Center",
    datetime: "2024-12-09T16:00:00",
    maxSize: 10,
    participantCount: 7,
    organizer: { id: "u3", name: "Jordan Williams" }
  },
  {
    id: "4",
    title: "Board Game Night",
    category: "social",
    description: "Bringing Catan, Codenames, and more! Come play games and meet awesome people.",
    location: "Adams House JCR",
    datetime: "2024-12-08T19:00:00",
    maxSize: 12,
    participantCount: 12,
    organizer: { id: "u4", name: "Emily Park" }
  },
  {
    id: "5",
    title: "Pottery Class for Beginners",
    category: "arts",
    description: "Learning the basics of wheel throwing. No experience needed!",
    location: "Ceramics Studio, SOCH",
    datetime: "2024-12-10T15:00:00",
    maxSize: 8,
    participantCount: 5,
    organizer: { id: "u5", name: "Alex Rivera" }
  },
];

const mockMessages: Message[] = [
  { id: "m1", senderId: "u1", senderName: "Sarah Chen", content: "Hey everyone! Looking forward to the session. I'll bring some snacks 🍪", createdAt: "2024-12-07T10:30:00" },
  { id: "m2", senderId: "u2", senderName: "Marcus Johnson", content: "Awesome! I'm stuck on problem 3, hoping we can work through it together", createdAt: "2024-12-07T11:15:00" },
  { id: "m3", senderId: "u3", senderName: "Emily Park", content: "I finished problem 3 - happy to help! 😊", createdAt: "2024-12-07T14:00:00" },
];

export const activitiesApi = {
  async list(search?: string, category?: string): Promise<Activity[]> {
    const backendUp = await checkBackendAvailability();
    if (!backendUp) {
      // Return filtered mock data
      return mockActivities.filter(a => {
        const matchesSearch = !search || 
          a.title.toLowerCase().includes(search.toLowerCase()) ||
          a.description.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = !category || a.category === category;
        return matchesSearch && matchesCategory;
      });
    }

    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (category) params.append('category', category);
    
    return apiFetch<Activity[]>(`/api/activities?${params}`);
  },

  async get(id: string): Promise<ActivityDetail | null> {
    const backendUp = await checkBackendAvailability();
    if (!backendUp) {
      const activity = mockActivities.find(a => a.id === id);
      if (!activity) return null;
      return {
        ...activity,
        participants: [
          { id: "u1", name: "Sarah Chen" },
          { id: "u2", name: "Marcus Johnson" },
          { id: "u3", name: "Emily Park" },
        ],
        hasJoined: false,
      };
    }
    
    try {
      return await apiFetch<ActivityDetail>(`/api/activities/${id}`);
    } catch {
      return null;
    }
  },

  async create(data: Omit<Activity, 'id' | 'participantCount' | 'organizer' | 'createdAt'>): Promise<{ id: string }> {
    const backendUp = await checkBackendAvailability();
    if (!backendUp) {
      return { id: 'mock-' + Date.now() };
    }
    return apiFetch<{ id: string }>('/api/activities', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(id: string, data: Partial<Activity>): Promise<void> {
    const backendUp = await checkBackendAvailability();
    if (!backendUp) return;
    
    await apiFetch(`/api/activities/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async delete(id: string): Promise<void> {
    const backendUp = await checkBackendAvailability();
    if (!backendUp) return;
    
    await apiFetch(`/api/activities/${id}`, { method: 'DELETE' });
  },

  async join(id: string): Promise<void> {
    const backendUp = await checkBackendAvailability();
    if (!backendUp) return;
    
    await apiFetch(`/api/activities/${id}/join`, { method: 'POST' });
  },

  async leave(id: string): Promise<void> {
    const backendUp = await checkBackendAvailability();
    if (!backendUp) return;
    
    await apiFetch(`/api/activities/${id}/leave`, { method: 'POST' });
  },

  async getMessages(activityId: string): Promise<Message[]> {
    const backendUp = await checkBackendAvailability();
    if (!backendUp) {
      return mockMessages;
    }
    
    return apiFetch<Message[]>(`/api/activities/${activityId}/messages`);
  },

  async sendMessage(activityId: string, content: string): Promise<Message> {
    const backendUp = await checkBackendAvailability();
    if (!backendUp) {
      return {
        id: 'mock-msg-' + Date.now(),
        senderId: 'mock-user',
        senderName: 'You',
        content,
        createdAt: new Date().toISOString(),
      };
    }
    
    return apiFetch<Message>(`/api/activities/${activityId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  },
};
