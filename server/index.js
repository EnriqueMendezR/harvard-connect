const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'harvard-huddle-secret-key-change-in-production';

// Initialize SQLite database
const db = new Database(path.join(__dirname, 'harvard_huddle.db'));

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    year TEXT DEFAULT '',
    concentration TEXT DEFAULT '',
    dorm TEXT DEFAULT '',
    interests TEXT DEFAULT '[]',
    instagram_handle TEXT DEFAULT '',
    profile_picture_url TEXT DEFAULT '',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS activities (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT DEFAULT '',
    location TEXT NOT NULL,
    datetime TEXT NOT NULL,
    max_size INTEGER NOT NULL,
    organizer_id TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    is_cancelled INTEGER DEFAULT 0,
    FOREIGN KEY (organizer_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS activity_participants (
    id TEXT PRIMARY KEY,
    activity_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    joined_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (activity_id) REFERENCES activities(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE(activity_id, user_id)
  );

  CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    activity_id TEXT NOT NULL,
    sender_id TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (activity_id) REFERENCES activities(id),
    FOREIGN KEY (sender_id) REFERENCES users(id)
  );
`);

console.log('Database initialized with tables');

// Middleware
app.use(cors());
app.use(express.json());

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Optional auth middleware (doesn't fail if no token)
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (!err) {
        req.user = user;
      }
    });
  }
  next();
};

// Helper to check Harvard email
const isHarvardEmail = (email) => {
  return email.endsWith('@college.harvard.edu') || email.endsWith('@harvard.edu');
};

// ============ AUTH ROUTES ============

// Signup
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    if (!isHarvardEmail(email)) {
      return res.status(400).json({ error: 'Please use a Harvard email address (@college.harvard.edu or @harvard.edu)' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if user exists
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existingUser) {
      return res.status(400).json({ error: 'An account with this email already exists' });
    }

    // Hash password and create user
    const passwordHash = await bcrypt.hash(password, 10);
    const userId = uuidv4();

    db.prepare(`
      INSERT INTO users (id, name, email, password_hash)
      VALUES (?, ?, ?, ?)
    `).run(userId, name, email, passwordHash);

    // Generate JWT
    const token = jwt.sign({ id: userId, email }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: { id: userId, name, email }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Failed to create account' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    if (!isHarvardEmail(email)) {
      return res.status(400).json({ error: 'Please use a Harvard email address (@college.harvard.edu or @harvard.edu)' });
    }

    // Find user
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

// Get current user
app.get('/api/me', authenticateToken, (req, res) => {
  try {
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      year: user.year || '',
      concentration: user.concentration || '',
      dorm: user.dorm || '',
      interests: JSON.parse(user.interests || '[]'),
      instagramHandle: user.instagram_handle || '',
      profilePictureUrl: user.profile_picture_url || '',
      createdAt: user.created_at,
      updatedAt: user.updated_at
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user profile' });
  }
});

// Update current user profile
app.put('/api/me', authenticateToken, (req, res) => {
  try {
    const { name, year, concentration, dorm, interests, instagramHandle, profilePictureUrl } = req.body;

    db.prepare(`
      UPDATE users SET
        name = COALESCE(?, name),
        year = COALESCE(?, year),
        concentration = COALESCE(?, concentration),
        dorm = COALESCE(?, dorm),
        interests = COALESCE(?, interests),
        instagram_handle = COALESCE(?, instagram_handle),
        profile_picture_url = COALESCE(?, profile_picture_url),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      name,
      year,
      concentration,
      dorm,
      interests ? JSON.stringify(interests) : null,
      instagramHandle,
      profilePictureUrl,
      req.user.id
    );

    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
    
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      year: user.year || '',
      concentration: user.concentration || '',
      dorm: user.dorm || '',
      interests: JSON.parse(user.interests || '[]'),
      instagramHandle: user.instagram_handle || '',
      profilePictureUrl: user.profile_picture_url || '',
      createdAt: user.created_at,
      updatedAt: user.updated_at
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// ============ ACTIVITIES ROUTES ============

// List activities
app.get('/api/activities', optionalAuth, (req, res) => {
  try {
    const { search, category } = req.query;

    let query = `
      SELECT 
        a.*,
        u.name as organizer_name,
        u.profile_picture_url as organizer_picture,
        (SELECT COUNT(*) FROM activity_participants WHERE activity_id = a.id) as participant_count
      FROM activities a
      JOIN users u ON a.organizer_id = u.id
      WHERE a.is_cancelled = 0
    `;

    const params = [];

    if (search) {
      query += ` AND (a.title LIKE ? OR a.description LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }

    if (category) {
      query += ` AND a.category = ?`;
      params.push(category);
    }

    query += ` ORDER BY a.datetime ASC`;

    const activities = db.prepare(query).all(...params);

    res.json(activities.map(a => ({
      id: a.id,
      title: a.title,
      category: a.category,
      description: a.description,
      location: a.location,
      datetime: a.datetime,
      maxSize: a.max_size,
      participantCount: a.participant_count,
      organizer: {
        id: a.organizer_id,
        name: a.organizer_name,
        profilePictureUrl: a.organizer_picture || ''
      },
      createdAt: a.created_at,
      isCancelled: !!a.is_cancelled
    })));
  } catch (error) {
    console.error('List activities error:', error);
    res.status(500).json({ error: 'Failed to fetch activities' });
  }
});

// Get single activity
app.get('/api/activities/:id', optionalAuth, (req, res) => {
  try {
    const activity = db.prepare(`
      SELECT 
        a.*,
        u.name as organizer_name,
        u.profile_picture_url as organizer_picture
      FROM activities a
      JOIN users u ON a.organizer_id = u.id
      WHERE a.id = ?
    `).get(req.params.id);

    if (!activity) {
      return res.status(404).json({ error: 'Activity not found' });
    }

    // Get participants
    const participants = db.prepare(`
      SELECT u.id, u.name, u.profile_picture_url
      FROM activity_participants ap
      JOIN users u ON ap.user_id = u.id
      WHERE ap.activity_id = ?
    `).all(req.params.id);

    // Get participant count
    const participantCount = participants.length;

    // Check if current user has joined
    let hasJoined = false;
    if (req.user) {
      const membership = db.prepare(
        'SELECT id FROM activity_participants WHERE activity_id = ? AND user_id = ?'
      ).get(req.params.id, req.user.id);
      hasJoined = !!membership;
    }

    res.json({
      id: activity.id,
      title: activity.title,
      category: activity.category,
      description: activity.description,
      location: activity.location,
      datetime: activity.datetime,
      maxSize: activity.max_size,
      participantCount,
      organizer: {
        id: activity.organizer_id,
        name: activity.organizer_name,
        profilePictureUrl: activity.organizer_picture || ''
      },
      participants: participants.map(p => ({
        id: p.id,
        name: p.name,
        profilePictureUrl: p.profile_picture_url || ''
      })),
      hasJoined,
      createdAt: activity.created_at,
      isCancelled: !!activity.is_cancelled
    });
  } catch (error) {
    console.error('Get activity error:', error);
    res.status(500).json({ error: 'Failed to fetch activity' });
  }
});

// Create activity
app.post('/api/activities', authenticateToken, (req, res) => {
  try {
    const { title, category, description, location, datetime, maxSize } = req.body;

    if (!title || !category || !location || !datetime || !maxSize) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const activityId = uuidv4();

    db.prepare(`
      INSERT INTO activities (id, title, category, description, location, datetime, max_size, organizer_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(activityId, title, category, description || '', location, datetime, maxSize, req.user.id);

    // Auto-join organizer as participant
    db.prepare(`
      INSERT INTO activity_participants (id, activity_id, user_id)
      VALUES (?, ?, ?)
    `).run(uuidv4(), activityId, req.user.id);

    res.status(201).json({ id: activityId, message: 'Activity created' });
  } catch (error) {
    console.error('Create activity error:', error);
    res.status(500).json({ error: 'Failed to create activity' });
  }
});

// Update activity
app.put('/api/activities/:id', authenticateToken, (req, res) => {
  try {
    const activity = db.prepare('SELECT * FROM activities WHERE id = ?').get(req.params.id);
    
    if (!activity) {
      return res.status(404).json({ error: 'Activity not found' });
    }

    if (activity.organizer_id !== req.user.id) {
      return res.status(403).json({ error: 'Only the organizer can update this activity' });
    }

    const { title, category, description, location, datetime, maxSize, isCancelled } = req.body;

    db.prepare(`
      UPDATE activities SET
        title = COALESCE(?, title),
        category = COALESCE(?, category),
        description = COALESCE(?, description),
        location = COALESCE(?, location),
        datetime = COALESCE(?, datetime),
        max_size = COALESCE(?, max_size),
        is_cancelled = COALESCE(?, is_cancelled)
      WHERE id = ?
    `).run(title, category, description, location, datetime, maxSize, isCancelled ? 1 : 0, req.params.id);

    res.json({ message: 'Activity updated' });
  } catch (error) {
    console.error('Update activity error:', error);
    res.status(500).json({ error: 'Failed to update activity' });
  }
});

// Delete activity
app.delete('/api/activities/:id', authenticateToken, (req, res) => {
  try {
    const activity = db.prepare('SELECT * FROM activities WHERE id = ?').get(req.params.id);
    
    if (!activity) {
      return res.status(404).json({ error: 'Activity not found' });
    }

    if (activity.organizer_id !== req.user.id) {
      return res.status(403).json({ error: 'Only the organizer can delete this activity' });
    }

    db.prepare('DELETE FROM messages WHERE activity_id = ?').run(req.params.id);
    db.prepare('DELETE FROM activity_participants WHERE activity_id = ?').run(req.params.id);
    db.prepare('DELETE FROM activities WHERE id = ?').run(req.params.id);

    res.json({ message: 'Activity deleted' });
  } catch (error) {
    console.error('Delete activity error:', error);
    res.status(500).json({ error: 'Failed to delete activity' });
  }
});

// Join activity
app.post('/api/activities/:id/join', authenticateToken, (req, res) => {
  try {
    const activity = db.prepare(`
      SELECT a.*, (SELECT COUNT(*) FROM activity_participants WHERE activity_id = a.id) as participant_count
      FROM activities a WHERE a.id = ?
    `).get(req.params.id);

    if (!activity) {
      return res.status(404).json({ error: 'Activity not found' });
    }

    if (activity.participant_count >= activity.max_size) {
      return res.status(400).json({ error: 'Activity is full' });
    }

    // Check if already joined
    const existing = db.prepare(
      'SELECT id FROM activity_participants WHERE activity_id = ? AND user_id = ?'
    ).get(req.params.id, req.user.id);

    if (existing) {
      return res.status(400).json({ error: 'Already joined this activity' });
    }

    db.prepare(`
      INSERT INTO activity_participants (id, activity_id, user_id)
      VALUES (?, ?, ?)
    `).run(uuidv4(), req.params.id, req.user.id);

    res.json({ message: 'Joined activity' });
  } catch (error) {
    console.error('Join activity error:', error);
    res.status(500).json({ error: 'Failed to join activity' });
  }
});

// Leave activity
app.post('/api/activities/:id/leave', authenticateToken, (req, res) => {
  try {
    const activity = db.prepare('SELECT * FROM activities WHERE id = ?').get(req.params.id);

    if (!activity) {
      return res.status(404).json({ error: 'Activity not found' });
    }

    if (activity.organizer_id === req.user.id) {
      return res.status(400).json({ error: 'Organizer cannot leave their own activity' });
    }

    db.prepare(
      'DELETE FROM activity_participants WHERE activity_id = ? AND user_id = ?'
    ).run(req.params.id, req.user.id);

    res.json({ message: 'Left activity' });
  } catch (error) {
    console.error('Leave activity error:', error);
    res.status(500).json({ error: 'Failed to leave activity' });
  }
});

// ============ MESSAGES ROUTES ============

// Get messages for activity
app.get('/api/activities/:id/messages', authenticateToken, (req, res) => {
  try {
    // Check if user is participant
    const participant = db.prepare(
      'SELECT id FROM activity_participants WHERE activity_id = ? AND user_id = ?'
    ).get(req.params.id, req.user.id);

    if (!participant) {
      return res.status(403).json({ error: 'You must join this activity to view messages' });
    }

    const messages = db.prepare(`
      SELECT m.*, u.name as sender_name, u.profile_picture_url as sender_picture
      FROM messages m
      JOIN users u ON m.sender_id = u.id
      WHERE m.activity_id = ?
      ORDER BY m.created_at ASC
    `).all(req.params.id);

    res.json(messages.map(m => ({
      id: m.id,
      senderId: m.sender_id,
      senderName: m.sender_name,
      senderPicture: m.sender_picture || '',
      content: m.content,
      createdAt: m.created_at
    })));
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Send message
app.post('/api/activities/:id/messages', authenticateToken, (req, res) => {
  try {
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Message content is required' });
    }

    // Check if user is participant
    const participant = db.prepare(
      'SELECT id FROM activity_participants WHERE activity_id = ? AND user_id = ?'
    ).get(req.params.id, req.user.id);

    if (!participant) {
      return res.status(403).json({ error: 'You must join this activity to send messages' });
    }

    const messageId = uuidv4();

    db.prepare(`
      INSERT INTO messages (id, activity_id, sender_id, content)
      VALUES (?, ?, ?, ?)
    `).run(messageId, req.params.id, req.user.id, content.trim());

    const user = db.prepare('SELECT name, profile_picture_url FROM users WHERE id = ?').get(req.user.id);

    res.status(201).json({
      id: messageId,
      senderId: req.user.id,
      senderName: user.name,
      senderPicture: user.profile_picture_url || '',
      content: content.trim(),
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
