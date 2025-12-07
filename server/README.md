# Harvard Huddle Backend Server

This is the Node.js + SQLite backend for Harvard Huddle.

## Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```
   
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:3001` by default.

## Environment Variables

- `PORT` - Server port (default: 3001)
- `JWT_SECRET` - Secret key for JWT tokens (change in production!)

## Connecting the Frontend

To connect the frontend to this backend, create a `.env` file in the project root:

```env
VITE_API_URL=http://localhost:3001
```

Then rebuild/restart the frontend.

## Database

The SQLite database (`huddle.db`) is created automatically on first run. It includes:

- `users` - User accounts with profile information
- `activities` - Activity listings
- `activity_participants` - Tracks who has joined which activities
- `messages` - Activity group chat messages

## API Endpoints

### Auth
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login
- `GET /api/me` - Get current user

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/me` - Update own profile

### Activities
- `GET /api/activities` - List activities (supports `?search=` and `?category=`)
- `GET /api/activities/:id` - Get activity with participants and messages
- `POST /api/activities` - Create activity
- `POST /api/activities/:id/join` - Join activity
- `POST /api/activities/:id/leave` - Leave activity
- `POST /api/activities/:id/messages` - Send message
