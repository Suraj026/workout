# Workout Tracker — Frontend

A React + Vite single-page application for tracking workouts. Connects to the [Workout API](../server) for authentication and data persistence.

## Features

- **User Authentication** — Login and signup forms with JWT token storage in `localStorage`
- **Protected Routes** — Private route guard redirects unauthenticated users to login
- **Workout CRUD** — Create, read, update, and delete workout entries
- **Filtering & Sorting** — Filter by completion status and sort by date (newest/oldest first)
- **Responsive Design** — Styled with CSS custom properties, supports light and dark mode

## Tech Stack

| Category    | Technology              |
| ----------- | ----------------------- |
| Framework   | React 19                |
| Build Tool  | Vite 8                  |
| HTTP Client | Axios                   |
| Routing     | React Router 7          |
| Styling     | CSS (custom properties) |

## Project Structure

```
client/
├── index.html
├── vite.config.js
├── package.json
├── README.md
└── src/
    ├── App.jsx              # Root component — routes & navigation
    ├── main.jsx             # Entry point — renders <App /> in StrictMode
    ├── index.css            # Global styles (design tokens, layout, components)
    ├── api/
    │   └── axios.js         # Axios instance with JWT interceptor
    ├── components/
    │   └── PrivateRoute.jsx # Route guard — redirects to /login if no token
    └── pages/
        ├── Login.jsx        # Login form — POST /login
        ├── Signup.jsx       # Signup form — POST /signup
        └── Dashboard.jsx    # Workout list, create/edit form, delete, filter/sort
```

## Setup

### Prerequisites

- Node.js 20+
- The [backend API](../server) running on `http://localhost:5000`

### Installation

```bash
npm install
```

### Environment Variables

No environment variables are required. The API base URL is hardcoded in `src/api/axios.js`:

```js
const api = axios.create({ baseURL: "http://localhost:5000" });
```

### Running the Dev Server

```bash
npm run dev
```

The app starts on `http://localhost:5173`.

## API Integration

The Axios instance in `src/api/axios.js` automatically attaches the JWT token from `localStorage` to every request:

```js
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});
```

### Endpoints Used

| Method | Path                | Auth | Used In         |
| ------ | ------------------- | ---- | --------------- |
| POST   | `/login`            | No   | `Login.jsx`     |
| POST   | `/signup`           | No   | `Signup.jsx`    |
| GET    | `/auth/workout`     | Yes  | `Dashboard.jsx` |
| POST   | `/auth/create`      | Yes  | `Dashboard.jsx` |
| PUT    | `/auth/workout/:id` | Yes  | `Dashboard.jsx` |
| DELETE | `/auth/workout/:id` | Yes  | `Dashboard.jsx` |

## Architecture Notes

- **State management:** All workout state lives in `Dashboard.jsx` via `useState`. No global state manager (Redux/Zustand) is used.
- **Routing:** `App.jsx` defines three routes — `/login`, `/signup`, and `/dashboard` (protected by `PrivateRoute`). The root path `/` redirects to login.
- **Form handling:** The same form handles both create and edit modes. When `editingId` is set, the submit handler sends a PUT request instead of POST.
- **StrictMode:** `main.jsx` wraps `<App />` in React's `<StrictMode>`, which double-invokes effects in development. This is expected behavior and does not affect production.
