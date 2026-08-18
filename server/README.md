# Workout API

A RESTful backend API for tracking workouts built with Express 5, MongoDB, and JWT authentication.

## Features

- **User Authentication** — Signup and login with email/password, secured by bcrypt hashing and JWT tokens
- **Workout Management** — Full CRUD operations for workout records (exercise name, sets, reps, weight, completion status)
- **Input Validation** — All request bodies validated with Zod schemas before reaching controllers
- **Protected Routes** — JWT-based authentication middleware guards all workout endpoints
- **Filtering & Sorting** — Query parameters for filtering by completion status and sorting by date
- **Centralized Error Handling** — Custom `AppError` class with a single error-handling middleware for consistent JSON error responses
- **Health Check** — `/health` endpoint for monitoring server status

## Tech Stack

| Category         | Technology                     |
| ---------------- | ------------------------------ |
| Runtime          | Node.js (ESM)                  |
| Framework        | Express 5                      |
| Database         | MongoDB (via Mongoose 9)       |
| Validation       | Zod 4                          |
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
| GET    | `/auth/workout`     | Yes           | Get all workouts for the authenticated user. Query params: `completed`, `sort`                |
| POST   | `/auth/create`      | Yes           | Create a new workout — body: `exerciseName`, `sets`, `reps`, `weight?`, `date?`, `completed?` |
| GET    | `/auth/workout/:id` | Yes           | Get a specific workout by ID                                                                  |
| PUT    | `/auth/workout/:id` | Yes           | Update a specific workout by ID — body: same as create (all fields optional)                  |
| DELETE | `/auth/workout/:id` | Yes           | Delete a specific workout by ID                                                               |

### Query Parameters

The `GET /auth/workout` endpoint supports the following query parameters:

| Parameter   | Values                   | Description                          |
| ----------- | ------------------------ | ------------------------------------ |
| `completed` | `true` / `false`         | Filter workouts by completion status |
| `sort`      | `date_asc` / `date_desc` | Sort workouts by date                |

**Example:** `GET /auth/workout?completed=true&sort=date_desc`

### Response Shapes

**POST /auth/create** — Returns the created workout document:

```json
{
  "_id": "64f1a2b3c4d5e6f789012345",
  "exerciseName": "Push-ups",
  "sets": 3,
  "reps": 15,
  "weight": 0,
  "date": "2024-01-15T00:00:00.000Z",
  "completed": false,
  "user": "64f1a2b3c4d5e6f789012340",
  "__v": 0
}
```

**PUT /auth/workout/:id** — Returns the updated workout document (same shape as above).

**DELETE /auth/workout/:id** — Returns:

```json
{ "message": "Workout deleted successfully" }
```

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

| Variable     | Description                | Default |
| ------------ | -------------------------- | ------- |
| `MONGO_URI`  | MongoDB connection string  | —       |
| `PORT`       | Server port                | `5000`  |
| `JWT_SECRET` | Secret key for JWT signing | —       |

### Running the Server

```bash
# Development (with auto-restart)
npm run dev
```

The server starts on `http://localhost:5000`.

## Authentication Flow

1. **Signup** — `POST /signup` with `{ username, email, password }`. Password is hashed with bcrypt (10 rounds).
2. **Login** — `POST /login` with `{ email, password }`. Password is compared with bcrypt. If valid, a JWT token is issued with `{ id: userId }` payload and 1-hour expiry.
3. **Authenticated Requests** — The JWT is sent in the `Authorization` header as `Bearer <token>`. The `authMiddleware` verifies the token and attaches `req.user = { id: userId }` to the request.

## Error Handling

All errors flow through a centralized error-handling middleware. Controllers throw `AppError` instances with a message and HTTP status code:

| Error Message                                         | Status | When                             |
| ----------------------------------------------------- | ------ | -------------------------------- |
| `"User already exists"`                               | 409    | Signup with existing email       |
| `"Invalid email or password"`                         | 401    | Login with wrong credentials     |
| `"Unauthorized"`                                      | 401    | Missing or invalid JWT token     |
| `"JWT secret is not defined"`                         | 500    | `JWT_SECRET` env var missing     |
| `"Workout not found"`                                 | 404    | GET/PUT/DELETE with invalid ID   |
| `"Forbidden: You do not have access to this workout"` | 403    | Accessing another user's workout |
| `"Validation failed"`                                 | 400    | Invalid request body (Zod)       |

The error handler catches these and returns a consistent JSON response:

```json
{
  "success": false,
  "message": "Error message here"
}
```

## CORS

The server is configured to accept requests from `http://localhost:5173` (the Vite dev server). Update the `origin` in `app.js` if your frontend runs on a different port:

```js
app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);
```
