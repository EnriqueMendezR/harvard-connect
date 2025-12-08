/**
 * Harvard Connect Backend Server
 * Express.js REST API server for the Harvard Connect application
 * Handles authentication, user management, and activity management
 */

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { db, initializeDatabase } = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

// JWT secret for token signing/verification
// IMPORTANT: Set JWT_SECRET environment variable in production
const JWT_SECRET = process.env.JWT_SECRET || 'harvard-huddle-secret-key-change-in-production';

// ========== MIDDLEWARE ==========

// Enable CORS for frontend communication
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

/**
 * Authentication middleware
 * Verifies JWT token from Authorization header
 * Attaches decoded user info to req.user
 *
 * @middleware
 */
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract Bearer token

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user; // Attach user info to request
    next();
  });
}

// ========== HELPER FUNCTIONS ==========

/**
 * Validate Harvard email address
 * Ensures email ends with @harvard.edu or @college.harvard.edu
 *
 * @param {string} email - Email address to validate
 * @returns {boolean} True if valid Harvard email
 */
function isHarvardEmail(email) {
  return email.endsWith('@harvard.edu') || email.endsWith('@college.harvard.edu');
}

// ========== AUTHENTICATION ROUTES ==========

/**
 * POST /api/auth/signup
 * Register a new user account
 *
 * Body: { name, email, password, year?, concentration?, dorm?, interests?, instagram_handle? }
 * Returns: User object with JWT token
 * Validates: Harvard email, password length, unique email
 */
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password, year, concentration, dorm, interests, instagram_handle } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    if (!isHarvardEmail(email)) {
      return res.status(400).json({ message: 'Please use your Harvard email address (@harvard.edu or @college.harvard.edu)' });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' });
    }

    // Check if email already exists
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }

    const id = uuidv4();
    const password_hash = await bcrypt.hash(password, 10);

    db.prepare(`
      INSERT INTO users (id, name, email, password_hash, year, concentration, dorm, interests, instagram_handle)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, name, email, password_hash, year || '', concentration || '', dorm || '', JSON.stringify(interests || []), instagram_handle || '');

    const token = jwt.sign({ id, email }, JWT_SECRET, { expiresIn: '7d' });

    const user = db.prepare('SELECT id, name, email, year, concentration, dorm, interests, instagram_handle, profile_picture_url, created_at FROM users WHERE id = ?').get(id);
    user.interests = JSON.parse(user.interests);

    res.status(201).json({ ...user, token });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Failed to create account' });
  }
});

/**
 * POST /api/auth/login
 * Authenticate user with email and password
 *
 * Body: { email, password }
 * Returns: User object with JWT token (7-day expiration)
 */
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    delete user.password_hash;
    user.interests = JSON.parse(user.interests);

    res.json({ ...user, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
});

/**
 * GET /api/me
 * Get currently authenticated user's profile
 *
 * Auth: Required (JWT token)
 * Returns: User object without password
 */
app.get('/api/me', authenticateToken, (req, res) => {
  const user = db.prepare('SELECT id, name, email, year, concentration, dorm, interests, instagram_handle, profile_picture_url, created_at FROM users WHERE id = ?').get(req.user.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  user.interests = JSON.parse(user.interests);
  res.json(user);
});

// ========== USER PROFILE ROUTES ==========

/**
 * GET /api/users/:id
 * Get any user's public profile by ID
 *
 * Auth: Required
 * Params: id - User ID
 * Returns: User object
 */
app.get('/api/users/:id', authenticateToken, (req, res) => {
  const user = db.prepare('SELECT id, name, email, year, concentration, dorm, interests, instagram_handle, profile_picture_url, created_at FROM users WHERE id = ?').get(req.params.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  user.interests = JSON.parse(user.interests);
  res.json(user);
});

/**
 * PUT /api/users/me
 * Update current user's profile
 *
 * Auth: Required
 * Body: Partial user object (any combination of profile fields)
 * Returns: Updated user object
 * Note: Dynamically builds UPDATE query based on provided fields
 */
app.put('/api/users/me', authenticateToken, (req, res) => {
  const { name, year, concentration, dorm, interests, instagram_handle, profile_picture_url } = req.body;

  const updates = [];
  const values = [];

  // Build dynamic UPDATE query based on provided fields
  if (name !== undefined) { updates.push('name = ?'); values.push(name); }
  if (year !== undefined) { updates.push('year = ?'); values.push(year); }
  if (concentration !== undefined) { updates.push('concentration = ?'); values.push(concentration); }
  if (dorm !== undefined) { updates.push('dorm = ?'); values.push(dorm); }
  if (interests !== undefined) { updates.push('interests = ?'); values.push(JSON.stringify(interests)); }
  if (instagram_handle !== undefined) { updates.push('instagram_handle = ?'); values.push(instagram_handle); }
  if (profile_picture_url !== undefined) { updates.push('profile_picture_url = ?'); values.push(profile_picture_url); }

  // Always update the updated_at timestamp
  updates.push("updated_at = datetime('now')");

  if (updates.length === 1) {
    return res.status(400).json({ message: 'No fields to update' });
  }

  values.push(req.user.id);
  db.prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`).run(...values);

  const user = db.prepare('SELECT id, name, email, year, concentration, dorm, interests, instagram_handle, profile_picture_url, created_at, updated_at FROM users WHERE id = ?').get(req.user.id);
  user.interests = JSON.parse(user.interests);
  res.json(user);
});

// ========== ACTIVITY ROUTES ==========

/**
 * GET /api/activities
 * Get all activities with optional filtering
 *
 * Auth: Required
 * Query params:
 *   - search: Search in title/description
 *   - category: Filter by category (study, meal, sports, social, arts, etc.)
 * Returns: Array of activities with organizer info and participant count
 */
app.get('/api/activities', authenticateToken, (req, res) => {
  const { search, category } = req.query;

  // Base query joins activities with users and counts participants
  let query = `
    SELECT a.*, u.name as organizer_name, u.profile_picture_url as organizer_picture,
    (SELECT COUNT(*) FROM activity_participants WHERE activity_id = a.id) as participant_count
    FROM activities a
    JOIN users u ON a.organizer_id = u.id
    WHERE a.is_cancelled = 0
  `;
  const params = [];

  // Add category filter if provided
  if (category) {
    query += ' AND a.category = ?';
    params.push(category);
  }

  // Add search filter (searches both title and description)
  if (search) {
    query += ' AND (a.title LIKE ? OR a.description LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }

  // Sort by datetime (earliest first)
  query += ' ORDER BY a.datetime ASC';

  const activities = db.prepare(query).all(...params);
  
  const result = activities.map(a => ({
    id: a.id,
    title: a.title,
    category: a.category,
    description: a.description,
    location: a.location,
    datetime: a.datetime,
    max_size: a.max_size,
    participant_count: a.participant_count,
    organizer_id: a.organizer_id,
    organizer: {
      id: a.organizer_id,
      name: a.organizer_name,
      profile_picture_url: a.organizer_picture
    },
    created_at: a.created_at,
    is_cancelled: Boolean(a.is_cancelled)
  }));

  res.json(result);
});

// Get single activity with details
app.get('/api/activities/:id', authenticateToken, (req, res) => {
  const activity = db.prepare(`
    SELECT a.*, u.name as organizer_name, u.profile_picture_url as organizer_picture,
    (SELECT COUNT(*) FROM activity_participants WHERE activity_id = a.id) as participant_count
    FROM activities a
    JOIN users u ON a.organizer_id = u.id
    WHERE a.id = ?
  `).get(req.params.id);

  if (!activity) {
    return res.status(404).json({ message: 'Activity not found' });
  }

  const participants = db.prepare(`
    SELECT ap.id, ap.user_id, u.name, u.profile_picture_url, ap.joined_at
    FROM activity_participants ap
    JOIN users u ON ap.user_id = u.id
    WHERE ap.activity_id = ?
    ORDER BY ap.joined_at
  `).all(req.params.id);

  const messages = db.prepare(`
    SELECT m.id, m.activity_id, m.sender_id, u.name as sender_name, m.content, m.created_at
    FROM messages m
    JOIN users u ON m.sender_id = u.id
    WHERE m.activity_id = ?
    ORDER BY m.created_at
  `).all(req.params.id);

  res.json({
    id: activity.id,
    title: activity.title,
    category: activity.category,
    description: activity.description,
    location: activity.location,
    datetime: activity.datetime,
    max_size: activity.max_size,
    participant_count: activity.participant_count,
    organizer_id: activity.organizer_id,
    organizer: {
      id: activity.organizer_id,
      name: activity.organizer_name,
      profile_picture_url: activity.organizer_picture
    },
    created_at: activity.created_at,
    is_cancelled: Boolean(activity.is_cancelled),
    participants,
    messages
  });
});

// Create activity
app.post('/api/activities', authenticateToken, (req, res) => {
  const { title, category, description, location, datetime, max_size } = req.body;

  if (!title || !category || !location || !datetime || !max_size) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const id = uuidv4();
  const participantId = uuidv4();

  db.prepare(`
    INSERT INTO activities (id, title, category, description, location, datetime, max_size, organizer_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, title, category, description || '', location, datetime, max_size, req.user.id);

  // Add organizer as first participant
  db.prepare(`
    INSERT INTO activity_participants (id, activity_id, user_id)
    VALUES (?, ?, ?)
  `).run(participantId, id, req.user.id);

  const user = db.prepare('SELECT name, profile_picture_url FROM users WHERE id = ?').get(req.user.id);

  res.status(201).json({
    id,
    title,
    category,
    description: description || '',
    location,
    datetime,
    max_size,
    participant_count: 1,
    organizer_id: req.user.id,
    organizer: {
      id: req.user.id,
      name: user.name,
      profile_picture_url: user.profile_picture_url
    },
    created_at: new Date().toISOString(),
    is_cancelled: false
  });
});

// Join activity
app.post('/api/activities/:id/join', authenticateToken, (req, res) => {
  const activity = db.prepare('SELECT * FROM activities WHERE id = ?').get(req.params.id);
  if (!activity) {
    return res.status(404).json({ message: 'Activity not found' });
  }

  const participantCount = db.prepare('SELECT COUNT(*) as count FROM activity_participants WHERE activity_id = ?').get(req.params.id).count;
  if (participantCount >= activity.max_size) {
    return res.status(400).json({ message: 'Activity is full' });
  }

  const existing = db.prepare('SELECT id FROM activity_participants WHERE activity_id = ? AND user_id = ?').get(req.params.id, req.user.id);
  if (existing) {
    return res.status(400).json({ message: 'Already joined this activity' });
  }

  const id = uuidv4();
  db.prepare('INSERT INTO activity_participants (id, activity_id, user_id) VALUES (?, ?, ?)').run(id, req.params.id, req.user.id);

  res.json({ message: 'Joined activity successfully' });
});

// Leave activity
app.post('/api/activities/:id/leave', authenticateToken, (req, res) => {
  const activity = db.prepare('SELECT * FROM activities WHERE id = ?').get(req.params.id);
  if (!activity) {
    return res.status(404).json({ message: 'Activity not found' });
  }

  if (activity.organizer_id === req.user.id) {
    return res.status(400).json({ message: 'Organizer cannot leave their own activity' });
  }

  db.prepare('DELETE FROM activity_participants WHERE activity_id = ? AND user_id = ?').run(req.params.id, req.user.id);

  res.json({ message: 'Left activity successfully' });
});

// Send message
app.post('/api/activities/:id/messages', authenticateToken, (req, res) => {
  const { content } = req.body;
  if (!content || !content.trim()) {
    return res.status(400).json({ message: 'Message content is required' });
  }

  const activity = db.prepare('SELECT id FROM activities WHERE id = ?').get(req.params.id);
  if (!activity) {
    return res.status(404).json({ message: 'Activity not found' });
  }

  // Check if user is a participant
  const isParticipant = db.prepare('SELECT id FROM activity_participants WHERE activity_id = ? AND user_id = ?').get(req.params.id, req.user.id);
  if (!isParticipant) {
    return res.status(403).json({ message: 'Must be a participant to send messages' });
  }

  const id = uuidv4();
  const user = db.prepare('SELECT name FROM users WHERE id = ?').get(req.user.id);

  db.prepare('INSERT INTO messages (id, activity_id, sender_id, content) VALUES (?, ?, ?, ?)').run(id, req.params.id, req.user.id, content.trim());

  res.status(201).json({
    id,
    activity_id: req.params.id,
    sender_id: req.user.id,
    sender_name: user.name,
    content: content.trim(),
    created_at: new Date().toISOString()
  });
});

// Initialize database and start server
initializeDatabase();

app.listen(PORT, () => {
  console.log(`Harvard Huddle server running on http://localhost:${PORT}`);
});
