/**
 * Database Configuration Module
 * SQLite database setup and schema initialization for Harvard Connect
 * Uses better-sqlite3 for synchronous database operations
 */

const Database = require('better-sqlite3');
const path = require('path');

// Initialize SQLite database
const db = new Database(path.join(__dirname, 'huddle.db'));

// Enable foreign key constraints for referential integrity
db.pragma('foreign_keys = ON');

/**
 * Initialize database schema
 * Creates all necessary tables and indexes if they don't exist
 * Safe to run multiple times (uses IF NOT EXISTS)
 */
function initializeDatabase() {
  db.exec(`
    -- ========== USERS TABLE ==========
    -- Stores user profiles and authentication data
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,                          -- UUID
      name TEXT NOT NULL,                           -- Display name
      email TEXT UNIQUE NOT NULL,                   -- Harvard email (@harvard.edu or @college.harvard.edu)
      password_hash TEXT NOT NULL,                  -- bcrypt hashed password
      year TEXT,                                    -- Graduation year (e.g., "2027")
      concentration TEXT,                           -- Major/concentration
      dorm TEXT,                                    -- Residential house
      interests TEXT DEFAULT '[]',                  -- JSON array of interests
      instagram_handle TEXT,                        -- Instagram username (optional)
      profile_picture_url TEXT,                     -- Profile photo URL
      created_at TEXT DEFAULT (datetime('now')),    -- Account creation timestamp
      updated_at TEXT DEFAULT (datetime('now'))     -- Last profile update timestamp
    );

    -- ========== ACTIVITIES TABLE ==========
    -- Stores activity/event information
    CREATE TABLE IF NOT EXISTS activities (
      id TEXT PRIMARY KEY,                          -- UUID
      title TEXT NOT NULL,                          -- Activity title
      category TEXT NOT NULL CHECK(category IN ('study', 'meal', 'sports', 'social', 'arts', 'other')),
                                                    -- Activity category (enforced values)
      description TEXT,                             -- Detailed description
      location TEXT NOT NULL,                       -- Meeting location
      datetime TEXT NOT NULL,                       -- Activity date and time (ISO 8601)
      max_size INTEGER NOT NULL CHECK(max_size >= 2 AND max_size <= 50),
                                                    -- Maximum participants (2-50)
      organizer_id TEXT NOT NULL,                   -- Creator of the activity
      created_at TEXT DEFAULT (datetime('now')),    -- Creation timestamp
      is_cancelled INTEGER DEFAULT 0,               -- Boolean: 0 = active, 1 = cancelled
      FOREIGN KEY (organizer_id) REFERENCES users(id)
    );

    -- ========== ACTIVITY PARTICIPANTS TABLE ==========
    -- Many-to-many relationship between users and activities
    CREATE TABLE IF NOT EXISTS activity_participants (
      id TEXT PRIMARY KEY,                          -- UUID
      activity_id TEXT NOT NULL,                    -- Reference to activity
      user_id TEXT NOT NULL,                        -- Reference to user
      joined_at TEXT DEFAULT (datetime('now')),     -- When user joined
      FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE(activity_id, user_id)                  -- Prevent duplicate joins
    );

    -- ========== MESSAGES TABLE ==========
    -- Activity chat messages
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,                          -- UUID
      activity_id TEXT NOT NULL,                    -- Activity this message belongs to
      sender_id TEXT NOT NULL,                      -- User who sent the message
      content TEXT NOT NULL,                        -- Message text
      created_at TEXT DEFAULT (datetime('now')),    -- Message timestamp
      FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE,
      FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- ========== PERFORMANCE INDEXES ==========
    -- Speed up common queries
    CREATE INDEX IF NOT EXISTS idx_activities_datetime ON activities(datetime);
    CREATE INDEX IF NOT EXISTS idx_activities_category ON activities(category);
    CREATE INDEX IF NOT EXISTS idx_activity_participants_activity ON activity_participants(activity_id);
    CREATE INDEX IF NOT EXISTS idx_activity_participants_user ON activity_participants(user_id);
    CREATE INDEX IF NOT EXISTS idx_messages_activity ON messages(activity_id);
  `);

  console.log('Database initialized successfully');
}

module.exports = { db, initializeDatabase };
