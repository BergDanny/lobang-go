# Routes Documentation

This document describes all the routes available in the Lobang Go frontend application.

## Route Structure

### Public Routes
These routes are accessible without authentication. If a user is already authenticated, they will be redirected to the home page.

- **`/login`** - Login page
  - Component: `Login`
  - Redirects to `/` if already authenticated

- **`/register`** - Registration page
  - Component: `Register`
  - Redirects to `/` if already authenticated

### Protected Routes
These routes require authentication. Unauthenticated users will be redirected to `/login`.

- **`/`** - Home/Dashboard page
  - Component: `Home`
  - Shows welcome message, recent quests, and quick actions

- **`/quests`** - All quests listing page
  - Component: `Quests`
  - Displays all available quests

- **`/quests/create`** - Create new quest page
  - Component: `CreateQuest`
  - Form to create a new quest

- **`/quests/:id`** - Quest detail page
  - Component: `QuestDetail`
  - Shows detailed information about a specific quest
  - Includes edit and delete actions

### Error Routes

- **`*`** - 404 Not Found page
  - Component: `NotFound`
  - Catches all unmatched routes

## Navigation

The application includes a navigation bar (Layout component) that shows:

**For Authenticated Users:**
- Home link
- Quests link
- User name
- Logout button

**For Unauthenticated Users:**
- Login link
- Register button

## Route Protection

### ProtectedRoute Component
- Checks if user is authenticated
- Redirects to `/login` if not authenticated
- Wraps protected routes

### PublicRoute Component
- Checks if user is authenticated
- Redirects to `/` if already authenticated
- Wraps public routes (login/register)

## Usage Example

```tsx
import { Link } from 'react-router-dom';

// Navigate programmatically
import { useNavigate } from 'react-router-dom';
const navigate = useNavigate();
navigate('/quests');

// Link component
<Link to="/quests">View Quests</Link>
```

## Route Flow

1. **Unauthenticated User:**
   - Can access: `/login`, `/register`
   - Redirected from: `/`, `/quests`, `/quests/*`

2. **Authenticated User:**
   - Can access: All routes
   - Redirected from: `/login`, `/register` (to `/`)

