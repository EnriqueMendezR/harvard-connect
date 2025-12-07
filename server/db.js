const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'huddle.db'));

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize database schema
function initializeDatabase() {
  db.exec(`
    -- Users table
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      year TEXT,
      concentration TEXT,
      dorm TEXT,
      interests TEXT DEFAULT '[]',
      instagram_handle TEXT,
      profile_picture_url TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    -- Activities table
    CREATE TABLE IF NOT EXISTS activities (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT NOT NULL CHECK(category IN ('study', 'meal', 'sports', 'social', 'arts', 'other')),
      description TEXT,
      location TEXT NOT NULL,
      datetime TEXT NOT NULL,
      max_size INTEGER NOT NULL CHECK(max_size >= 2 AND max_size <= 50),
      organizer_id TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      is_cancelled INTEGER DEFAULT 0,
      FOREIGN KEY (organizer_id) REFERENCES users(id)
    );

    -- Activity participants table
    CREATE TABLE IF NOT EXISTS activity_participants (
      id TEXT PRIMARY KEY,
      activity_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      joined_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE(activity_id, user_id)
    );

    -- Messages table
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      activity_id TEXT NOT NULL,
      sender_id TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE,
      FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Create indexes for performance
    CREATE INDEX IF NOT EXISTS idx_activities_datetime ON activities(datetime);
    CREATE INDEX IF NOT EXISTS idx_activities_category ON activities(category);
    CREATE INDEX IF NOT EXISTS idx_activity_participants_activity ON activity_participants(activity_id);
    CREATE INDEX IF NOT EXISTS idx_activity_participants_user ON activity_participants(user_id);
    CREATE INDEX IF NOT EXISTS idx_messages_activity ON messages(activity_id);
  `);

  console.log('Database initialized successfully');
}

module.exports = { db, initializeDatabase };
