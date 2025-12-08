/**
 * Type Definitions for Harvard Connect Application
 * Defines all TypeScript interfaces and types used across the app
 */

// ========== USER TYPES ==========

/**
 * User profile interface
 * Represents a registered user in the system
 */
export interface User {
  /** Unique user identifier (UUID) */
  id: string;
  /** Display name */
  name: string;
  /** Harvard email address */
  email: string;
  /** Graduation year (e.g., "2027") */
  year?: string;
  /** Academic concentration/major */
  concentration?: string;
  /** Residential house/dorm */
  dorm?: string;
  /** Array of user interests/hobbies */
  interests: string[];
  /** Instagram username (optional social link) */
  instagram_handle?: string;
  /** Profile photo URL */
  profile_picture_url?: string;
  /** Account creation timestamp (ISO 8601) */
  created_at: string;
  /** Last profile update timestamp (ISO 8601) */
  updated_at?: string;
}

/**
 * Authenticated user interface
 * Extends User with JWT authentication token
 */
export interface AuthUser extends User {
  /** JWT token for authenticated requests */
  token: string;
}

// ========== ACTIVITY TYPES ==========

/**
 * Activity category enum
 * Defines all possible activity types
 */
export type ActivityCategory = "study" | "meal" | "sports" | "social" | "arts" | "other";

/**
 * Activity interface
 * Represents a planned activity/event
 */
export interface Activity {
  /** Unique activity identifier (UUID) */
  id: string;
  /** Activity title/name */
  title: string;
  /** Activity category */
  category: ActivityCategory;
  /** Detailed description */
  description: string;
  /** Meeting location */
  location: string;
  /** Scheduled date and time (ISO 8601) */
  datetime: string;
  /** Maximum number of participants */
  max_size: number;
  /** Current number of participants */
  participant_count: number;
  /** ID of user who created the activity */
  organizer_id: string;
  /** Basic organizer info */
  organizer: {
    id: string;
    name: string;
    profile_picture_url?: string;
  };
  /** Activity creation timestamp (ISO 8601) */
  created_at: string;
  /** Whether activity has been cancelled */
  is_cancelled: boolean;
}

/**
 * Activity with full details
 * Extends Activity with participants list and messages
 * Used on the activity detail page
 */
export interface ActivityWithDetails extends Activity {
  /** List of all participants */
  participants: Participant[];
  /** Activity chat messages */
  messages: Message[];
}

/**
 * Activity participant interface
 * Represents a user who has joined an activity
 */
export interface Participant {
  /** Participant record ID */
  id: string;
  /** User ID of the participant */
  user_id: string;
  /** Participant display name */
  name: string;
  /** Participant profile picture */
  profile_picture_url?: string;
  /** When user joined the activity (ISO 8601) */
  joined_at: string;
}

/**
 * Message interface
 * Represents a chat message within an activity
 */
export interface Message {
  /** Unique message identifier */
  id: string;
  /** Activity this message belongs to */
  activity_id: string;
  /** User who sent the message */
  sender_id: string;
  /** Sender's display name */
  sender_name: string;
  /** Message text content */
  content: string;
  /** Message timestamp (ISO 8601) */
  created_at: string;
}

// ========== REQUEST/FORM TYPES ==========

/**
 * Login credentials interface
 * Data required for user authentication
 */
export interface LoginCredentials {
  /** Harvard email address */
  email: string;
  /** User password */
  password: string;
}

/**
 * Signup data interface
 * Data required for new user registration
 */
export interface SignupData {
  /** Display name */
  name: string;
  /** Harvard email address */
  email: string;
  /** Password (min 8 characters) */
  password: string;
  /** Graduation year (optional) */
  year?: string;
  /** Academic concentration (optional) */
  concentration?: string;
  /** Residential house/dorm (optional) */
  dorm?: string;
  /** Array of interests (optional) */
  interests?: string[];
  /** Instagram username (optional) */
  instagram_handle?: string;
}

/**
 * Create activity data interface
 * Data required to create a new activity
 */
export interface CreateActivityData {
  /** Activity title */
  title: string;
  /** Activity category */
  category: ActivityCategory;
  /** Detailed description */
  description: string;
  /** Meeting location */
  location: string;
  /** Scheduled date and time (ISO 8601) */
  datetime: string;
  /** Maximum participants (2-50) */
  max_size: number;
}

/**
 * Update profile data interface
 * Partial user data for profile updates
 * All fields optional to allow updating individual fields
 */
export interface UpdateProfileData {
  /** Updated display name */
  name?: string;
  /** Updated graduation year */
  year?: string;
  /** Updated concentration */
  concentration?: string;
  /** Updated dorm */
  dorm?: string;
  /** Updated interests array */
  interests?: string[];
  /** Updated Instagram handle */
  instagram_handle?: string;
  /** Updated profile picture URL */
  profile_picture_url?: string;
}
