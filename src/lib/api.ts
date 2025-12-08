/**
 * API Client Module
 * Handles all communication with the backend server
 * Supports both real backend mode and preview mode with mock data
 */

import type {
  User,
  AuthUser,
  Activity,
  ActivityWithDetails,
  LoginCredentials,
  SignupData,
  CreateActivityData,
  UpdateProfileData,
  Message
} from './types';

/**
 * API base URL configuration
 * Set VITE_API_URL environment variable to point to backend server
 * If not set, app runs in preview mode with mock data
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

/**
 * Preview mode flag
 * When true, uses mock data instead of real backend calls
 * Useful for development and demonstrations without a backend
 */
const isPreviewMode = !API_BASE_URL || API_BASE_URL === '';

/**
 * Generic API call helper function
 * Handles authentication headers, request/response formatting, and error handling
 *
 * @param endpoint - API endpoint path (e.g., '/api/activities')
 * @param options - Fetch options (method, body, headers, etc.)
 * @returns Parsed JSON response
 * @throws Error with message from server or generic error
 */
async function apiCall<T>(endpoint: string, options?: RequestInit): Promise<T> {
  // Retrieve auth token from localStorage for authenticated requests
  const token = localStorage.getItem('auth_token');

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      // Include Bearer token if available
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });

  // Handle error responses
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || 'Request failed');
  }

  return response.json();
}

// ============ MOCK DATA FOR PREVIEW MODE ============
// Used when no backend is configured to provide a working demo experience

/** Mock users storage (currently empty, populated on signup/login) */
const mockUsers: User[] = [];

/** Sample activities for preview mode demonstration */
const mockActivities: Activity[] = [
  {
    id: "1",
    title: "CS50 Problem Set Study Session",
    category: "study",
    description: "Working through this week's problem set together. All skill levels welcome!",
    location: "Lamont Library, B Level",
    datetime: "2024-12-08T14:00:00",
    max_size: 6,
    participant_count: 4,
    organizer_id: "organizer-1",
    organizer: { id: "organizer-1", name: "Activity Organizer" },
    created_at: "2024-12-01T10:00:00",
    is_cancelled: false
  },
  {
    id: "2",
    title: "Sunday Brunch at Annenberg",
    category: "meal",
    description: "Let's grab brunch together! Perfect for meeting new people.",
    location: "Annenberg Hall",
    datetime: "2024-12-08T11:00:00",
    max_size: 8,
    participant_count: 3,
    organizer_id: "u2",
    organizer: { id: "u2", name: "Alex Rivera" },
    created_at: "2024-12-01T10:00:00",
    is_cancelled: false
  },
  {
    id: "3",
    title: "Pickup Basketball @ MAC",
    category: "sports",
    description: "Casual 5v5 games. All skill levels welcome!",
    location: "Malkin Athletic Center",
    datetime: "2024-12-09T16:00:00",
    max_size: 10,
    participant_count: 7,
    organizer_id: "u3",
    organizer: { id: "u3", name: "Jordan Williams" },
    created_at: "2024-12-01T10:00:00",
    is_cancelled: false
  },
  {
    id: "4",
    title: "Board Game Night",
    category: "social",
    description: "Bringing Catan, Codenames, and more!",
    location: "Adams House JCR",
    datetime: "2024-12-08T19:00:00",
    max_size: 12,
    participant_count: 12,
    organizer_id: "u4",
    organizer: { id: "u4", name: "Emily Park" },
    created_at: "2024-12-01T10:00:00",
    is_cancelled: false
  },
  {
    id: "5",
    title: "Pottery Class for Beginners",
    category: "arts",
    description: "Learning the basics of wheel throwing. No experience needed!",
    location: "Ceramics Studio, SOCH",
    datetime: "2024-12-10T15:00:00",
    max_size: 8,
    participant_count: 5,
    organizer_id: "u5",
    organizer: { id: "u5", name: "Maria Santos" },
    created_at: "2024-12-01T10:00:00",
    is_cancelled: false
  },
  {
    id: "6",
    title: "Econ 1010a Exam Prep",
    category: "study",
    description: "Going through practice problems for the upcoming midterm.",
    location: "Widener Study Room 3B",
    datetime: "2024-12-09T10:00:00",
    max_size: 5,
    participant_count: 2,
    organizer_id: "u6",
    organizer: { id: "u6", name: "David Kim" },
    created_at: "2024-12-01T10:00:00",
    is_cancelled: false
  },
];

/** Sample messages for preview mode */
const mockMessages: Message[] = [
  { id: "m1", activity_id: "1", sender_id: "organizer-1", sender_name: "Activity Organizer", content: "Looking forward to the session!", created_at: "2024-12-07T10:30:00" },
  { id: "m2", activity_id: "1", sender_id: "u2", sender_name: "Alex R.", content: "I'm stuck on problem 3, hoping we can work through it together", created_at: "2024-12-07T11:15:00" },
];

/** In-memory storage for current user session in preview mode */
let mockCurrentUser: AuthUser | null = null;

// ============ AUTHENTICATION API ============
/**
 * Authentication API methods
 * Handles user login, signup, session management, and logout
 */

export const authApi = {
  /**
   * Login user with email and password
   * In preview mode: validates Harvard email and creates mock session
   * In backend mode: authenticates against real server
   *
   * @param credentials - Email and password
   * @returns Authenticated user with token
   * @throws Error if credentials invalid or not Harvard email
   */
  async login(credentials: LoginCredentials): Promise<AuthUser> {
    if (isPreviewMode) {
      // Simulate API delay for realistic UX
      await new Promise(r => setTimeout(r, 500));

      // Validate Harvard email domain
      if (!credentials.email.endsWith('@harvard.edu') && !credentials.email.endsWith('@college.harvard.edu')) {
        throw new Error('Please use your Harvard email address');
      }
      
      mockCurrentUser = {
        id: 'demo-user',
        name: 'Test',
        email: credentials.email,
        year: '2027',
        concentration: 'Computer Science',
        dorm: 'Adams House',
        interests: ['coding', 'basketball', 'board games'],
        instagram_handle: 'demo_user',
        created_at: new Date().toISOString(),
        token: 'mock-token-' + Date.now()
      };
      localStorage.setItem('auth_token', mockCurrentUser.token);
      localStorage.setItem('current_user', JSON.stringify(mockCurrentUser));
      return mockCurrentUser;
    }
    
    return apiCall<AuthUser>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  /**
   * Register new user account
   * Validates Harvard email and creates user profile
   *
   * @param data - User signup information (name, email, password, profile details)
   * @returns Authenticated user with token
   * @throws Error if email not Harvard domain
   */
  async signup(data: SignupData): Promise<AuthUser> {
    if (isPreviewMode) {
      await new Promise(r => setTimeout(r, 500));

      // Enforce Harvard email requirement
      if (!data.email.endsWith('@harvard.edu') && !data.email.endsWith('@college.harvard.edu')) {
        throw new Error('Please use your Harvard email address');
      }
      
      mockCurrentUser = {
        id: 'demo-user-' + Date.now(),
        name: data.name,
        email: data.email,
        year: data.year || '',
        concentration: data.concentration || '',
        dorm: data.dorm || '',
        interests: data.interests || [],
        instagram_handle: data.instagram_handle || '',
        created_at: new Date().toISOString(),
        token: 'mock-token-' + Date.now()
      };
      localStorage.setItem('auth_token', mockCurrentUser.token);
      localStorage.setItem('current_user', JSON.stringify(mockCurrentUser));
      return mockCurrentUser;
    }
    
    return apiCall<AuthUser>('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Get currently authenticated user
   * Retrieves user from localStorage (preview) or backend session
   *
   * @returns Current user or null if not authenticated
   */
  async getCurrentUser(): Promise<User | null> {
    if (isPreviewMode) {
      const stored = localStorage.getItem('current_user');
      if (stored) {
        return JSON.parse(stored);
      }
      return null;
    }

    try {
      return await apiCall<User>('/api/me');
    } catch {
      return null;
    }
  },

  /**
   * Logout current user
   * Clears all authentication data from storage and resets session
   */
  logout() {
    // Clear all auth-related storage (both localStorage and sessionStorage)
    localStorage.removeItem('auth_token');
    localStorage.removeItem('current_user');
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('current_user');
    mockCurrentUser = null;
  }
};

// ============ USERS API ============
/**
 * User profile management API
 * Handles fetching and updating user profiles
 */

export const usersApi = {
  async getProfile(userId: string): Promise<User> {
    if (isPreviewMode) {
      await new Promise(r => setTimeout(r, 300));
      const stored = localStorage.getItem('current_user');
      if (stored) {
        return JSON.parse(stored);
      }
      throw new Error('User not found');
    }
    
    return apiCall<User>(`/api/users/${userId}`);
  },

  async updateProfile(data: UpdateProfileData): Promise<User> {
    if (isPreviewMode) {
      await new Promise(r => setTimeout(r, 300));
      const stored = localStorage.getItem('current_user');
      if (stored) {
        const user = JSON.parse(stored);
        const updated = { ...user, ...data, updated_at: new Date().toISOString() };
        localStorage.setItem('current_user', JSON.stringify(updated));
        return updated;
      }
      throw new Error('Not authenticated');
    }
    
    return apiCall<User>('/api/users/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }
};

// ============ ACTIVITIES API ============
/**
 * Activities management API
 * Handles CRUD operations for activities, joining/leaving, and messaging
 */

export const activitiesApi = {
  /**
   * Get all activities with optional filtering
   * Supports search by title/description and filtering by category
   *
   * @param params - Optional search query and category filter
   * @returns Array of activities sorted by datetime
   */
  async getActivities(params?: { search?: string; category?: string }): Promise<Activity[]> {
    if (isPreviewMode) {
      await new Promise(r => setTimeout(r, 300));
      let filtered = [...mockActivities];

      // Filter by category if specified
      if (params?.category) {
        filtered = filtered.filter(a => a.category === params.category);
      }

      // Search in title and description if query provided
      if (params?.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter(a =>
          a.title.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q)
        );
      }

      // Sort by datetime (earliest first)
      return filtered.sort((a, b) =>
        new Date(a.datetime).getTime() - new Date(b.datetime).getTime()
      );
    }
    
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.set('search', params.search);
    if (params?.category) queryParams.set('category', params.category);
    
    return apiCall<Activity[]>(`/api/activities?${queryParams}`);
  },

  async getActivity(id: string): Promise<ActivityWithDetails> {
    if (isPreviewMode) {
      await new Promise(r => setTimeout(r, 300));
      const activity = mockActivities.find(a => a.id === id);
      if (!activity) throw new Error('Activity not found');
      
      return {
        ...activity,
        participants: [
          { id: '1', user_id: activity.organizer_id, name: activity.organizer.name, joined_at: activity.created_at },
        ],
        messages: mockMessages.filter(m => m.activity_id === id)
      };
    }
    
    return apiCall<ActivityWithDetails>(`/api/activities/${id}`);
  },

  async createActivity(data: CreateActivityData): Promise<Activity> {
    if (isPreviewMode) {
      await new Promise(r => setTimeout(r, 300));
      const stored = localStorage.getItem('current_user');
      if (!stored) {
        throw new Error('Not logged in');
      }
      const user = JSON.parse(stored);
      
      const newActivity: Activity = {
        id: 'new-' + Date.now(),
        ...data,
        participant_count: 1,
        organizer_id: user.id,
        organizer: { id: user.id, name: user.name },
        created_at: new Date().toISOString(),
        is_cancelled: false
      };
      mockActivities.unshift(newActivity);
      return newActivity;
    }
    
    return apiCall<Activity>('/api/activities', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Join an activity as a participant
   * Increments participant count and tracks in localStorage (preview mode)
   *
   * @param activityId - ID of activity to join
   * @throws Error if activity is full or user already joined
   */
  async joinActivity(activityId: string): Promise<void> {
    if (isPreviewMode) {
      await new Promise(r => setTimeout(r, 300));
      const activity = mockActivities.find(a => a.id === activityId);
      if (activity) {
        activity.participant_count++;
      }
      // Track joined activities in localStorage for persistence
      const joined = JSON.parse(localStorage.getItem('joined_activities') || '[]');
      if (!joined.includes(activityId)) {
        joined.push(activityId);
        localStorage.setItem('joined_activities', JSON.stringify(joined));
      }
      return;
    }

    await apiCall(`/api/activities/${activityId}/join`, { method: 'POST' });
  },

  /**
   * Leave an activity as a participant
   * Decrements participant count and removes from tracking
   *
   * @param activityId - ID of activity to leave
   */
  async leaveActivity(activityId: string): Promise<void> {
    if (isPreviewMode) {
      await new Promise(r => setTimeout(r, 300));
      const activity = mockActivities.find(a => a.id === activityId);
      if (activity && activity.participant_count > 0) {
        activity.participant_count--;
      }
      // Remove from joined activities tracking
      const joined = JSON.parse(localStorage.getItem('joined_activities') || '[]');
      const updated = joined.filter((id: string) => id !== activityId);
      localStorage.setItem('joined_activities', JSON.stringify(updated));
      return;
    }

    await apiCall(`/api/activities/${activityId}/leave`, { method: 'POST' });
  },

  /**
   * Send a message to an activity's chat
   * Creates message with current user as sender
   *
   * @param activityId - ID of activity to message
   * @param content - Message text content
   * @returns Created message object
   * @throws Error if user not authenticated
   */
  async sendMessage(activityId: string, content: string): Promise<Message> {
    if (isPreviewMode) {
      await new Promise(r => setTimeout(r, 200));
      const stored = localStorage.getItem('current_user');
      if (!stored) {
        throw new Error('Not logged in');
      }
      const user = JSON.parse(stored);

      const message: Message = {
        id: 'msg-' + Date.now(),
        activity_id: activityId,
        sender_id: user.id,
        sender_name: user.name,
        content,
        created_at: new Date().toISOString()
      };
      mockMessages.push(message);
      return message;
    }

    return apiCall<Message>(`/api/activities/${activityId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }
};
