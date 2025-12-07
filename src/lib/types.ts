// User types
export interface User {
  id: string;
  name: string;
  email: string;
  year?: string;
  concentration?: string;
  dorm?: string;
  interests: string[];
  instagram_handle?: string;
  profile_picture_url?: string;
  created_at: string;
  updated_at?: string;
}

export interface AuthUser extends User {
  token: string;
}

// Activity types
export type ActivityCategory = "study" | "meal" | "sports" | "social" | "arts" | "other";

export interface Activity {
  id: string;
  title: string;
  category: ActivityCategory;
  description: string;
  location: string;
  datetime: string;
  max_size: number;
  participant_count: number;
  organizer_id: string;
  organizer: {
    id: string;
    name: string;
    profile_picture_url?: string;
  };
  created_at: string;
  is_cancelled: boolean;
}

export interface ActivityWithDetails extends Activity {
  participants: Participant[];
  messages: Message[];
}

export interface Participant {
  id: string;
  user_id: string;
  name: string;
  profile_picture_url?: string;
  joined_at: string;
}

export interface Message {
  id: string;
  activity_id: string;
  sender_id: string;
  sender_name: string;
  content: string;
  created_at: string;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  year?: string;
  concentration?: string;
  dorm?: string;
  interests?: string[];
  instagram_handle?: string;
}

export interface CreateActivityData {
  title: string;
  category: ActivityCategory;
  description: string;
  location: string;
  datetime: string;
  max_size: number;
}

export interface UpdateProfileData {
  name?: string;
  year?: string;
  concentration?: string;
  dorm?: string;
  interests?: string[];
  instagram_handle?: string;
  profile_picture_url?: string;
}
