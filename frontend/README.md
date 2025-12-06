# Frontend - Lobang Go

React + TypeScript frontend application for Lobang Go.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

3. Start the development server:
```bash
npm run dev
```

## Project Structure

- `src/lib/api-client.ts` - Axios instance configured for API communication
- `src/services/api.ts` - API service functions for auth and quests
- `src/store/` - Zustand stores for state management
  - `authStore.ts` - Authentication state management
  - `questStore.ts` - Quest state management
- `src/types/api.ts` - TypeScript types matching backend API structure

## API Response Structure

The frontend is configured to handle the backend's response structure:

**Success Response:**
```json
{
  "success": true,
  "data": {...},
  "message": "Success message"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error message",
  "errors": {...}
}
```

## Usage Examples

### Authentication

```typescript
import { useAuthStore } from './store/authStore';

function LoginComponent() {
  const { login, isLoading, error, isAuthenticated } = useAuthStore();

  const handleLogin = async () => {
    try {
      await login({
        email: 'user@example.com',
        password: 'password'
      });
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div>
      {error && <p>Error: {error}</p>}
      <button onClick={handleLogin} disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Login'}
      </button>
    </div>
  );
}
```

### Quests

```typescript
import { useQuestStore } from './store/questStore';
import { useEffect } from 'react';

function QuestsList() {
  const { quests, fetchQuests, isLoading, error } = useQuestStore();

  useEffect(() => {
    fetchQuests();
  }, [fetchQuests]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {quests.map(quest => (
        <div key={quest.id}>
          <h3>{quest.title}</h3>
          <p>{quest.description}</p>
        </div>
      ))}
    </div>
  );
}
```

## Environment Variables

- `VITE_API_BASE_URL` - Base URL for the backend API (default: `http://localhost:8000/api/v1`)
