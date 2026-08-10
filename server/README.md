# Workout API

A RESTful backend API for tracking workouts built with Express 5, MongoDB and JWT authentication.

## Features

- **User Authentication** — Signup and login with email/password, secured by bcrypt hashing and JWT tokens
- **Workout Management** — Full CRUD operations for workout records (exercise name, sets, reps, weight, completion status)
- **Input Validation** — All request bodies validated with Zod schemas before reaching controllers
- **Protected Routes** — JWT-based authentication middleware guards all workout endpoints
- **Centralized Error Handling** — Custom `AppError` class with a single error-handling middleware for consistent JSON error responses
- **Health Check** — `/health` endpoint for monitoring server status

## Tech Stack

| Category         | Technology                     |
| ---------------- | ------------------------------ |
| Runtime          | Node.js (ESM)                  |
| Framework        | Express 5                      |
| Database         | MongoDB (via Mongoose)         |
| Validation       | Zod                            |
| Password Hashing | bcrypt                         |
| Authentication   | JSON Web Tokens (jsonwebtoken) |
| Dev Tool         | nodemon                        |

## Project Structure

```
server/
├── app.js                    # Express app entry point — middleware & route registration
├── config/
│   └── db.js                 # MongoDB/Mongoose connection setup
├── controllers/
│   ├── loginController.js    # Login handler — verifies user, issues JWT
│   ├── signupController.js   # Signup handler — hashes password, creates user
│   └── workoutController.js  # CRUD handlers for workout documents
├── routes/
│   ├── healthRoute.js        # GET /health
│   ├── loginRoute.js         # POST /login (with Zod validation)
│   ├── signupRoute.js        # POST /signup (with Zod validation)
│   └── workoutRoute.js       # CRUD /auth/* (with JWT auth + Zod validation)
├── models/
│   ├── userModel.js          # User schema (username, email, password)
│   └── workoutModel.js       # Workout schema (exerciseName, sets, reps, weight, date, completed, user ref)
├── middleware/
│   ├── authMiddleware.js     # JWT verification — protects /auth routes
│   ├── errorMiddleware.js    # Centralized error handler — catches AppError and returns JSON
│   └── notFoundMiddleware.js # 404 handler for undefined routes
├── schemas/
│   ├── authSchema.js         # Zod schemas for login & signup payloads
│   └── workoutSchema.js      # Zod schemas for create/update workout payloads
├── validators/
│   └── validate.js           # Middleware factory — runs Zod validation on req.body
├── utils/
│   └── appError.js           # Custom error class with statusCode
└── .env                      # Environment variables (MONGO_URI, JWT_SECRET, PORT)
```

## API Endpoints

| Method | Path                | Auth Required | Description                                                                                   |
| ------ | ------------------- | ------------- | --------------------------------------------------------------------------------------------- |
| GET    | `/health`           | No            | Health check — returns `{ status: "success" }`                                                |
| POST   | `/signup`           | No            | Register a new user — body: `username`, `email`, `password`                                   |
| POST   | `/login`            | No            | Login — body: `email`, `password`. Returns JWT token                                          |
| GET    | `/auth/workout`     | Yes           | Get all workouts for the authenticated user                                                   |
| POST   | `/auth/create`      | Yes           | Create a new workout — body: `exerciseName`, `sets`, `reps`, `weight?`, `date?`, `completed?` |
| GET    | `/auth/workout/:id` | Yes           | Get a specific workout by ID                                                                  |
| PUT    | `/auth/workout/:id` | Yes           | Update a specific workout by ID                                                               |
| DELETE | `/auth/workout/:id` | Yes           | Delete a specific workout by ID                                                               |

## Setup

### Prerequisites

- Node.js 20+
- MongoDB (local or Atlas)

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the server directory:

```env
MONGO_URI=mongodb://localhost:27017/workout
PORT=5000
JWT_SECRET=your_jwt_secret_here
```

### Running the Server

```bash
# Development (with auto-restart)
npm run dev

# Production
npm start
```

The server starts on `http://localhost:5000`.

## Error Handling

All errors flow through a centralized error-handling middleware. Controllers throw `AppError` instances with a message and HTTP status code:

```
AppError("User already exists", 409)
AppError("Invalid email or password", 401)
AppError("Workout not found", 404)
AppError("Forbidden: You do not have access to this workout", 403)
```

The error handler catches these and returns a consistent JSON response:

```json
{
  "success": false,
  "message": "Error message here"
}
```
