# Testing Guide for Frontend

This guide will help you test the frontend connection with the backend.

## Prerequisites

1. **Backend must be running**
   - Make sure your Laravel backend is running on `http://localhost:8000`
   - You can start it with: `cd backend && php artisan serve`

2. **Backend CORS Configuration**
   - Ensure your backend allows requests from `http://localhost:5173` (Vite default port)
   - Check `backend/config/sanctum.php` for stateful domains configuration

## Setup Steps

### 1. Create Environment File

The `.env` file has been created with:
```
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

If you need to change the backend URL, update this file.

### 2. Install Dependencies (if not already done)

```bash
cd frontend
npm install
```

### 3. Start the Development Server

```bash
npm run dev
```

The frontend will start on `http://localhost:5173` (or another port if 5173 is taken).

## Testing the Connection

### Test 1: Authentication (Register/Login)

1. Open `http://localhost:5173` in your browser
2. You should see a login/register form
3. **Test Registration:**
   - Click "Switch to Register"
   - Fill in:
     - Name: `Test User`
     - Email: `test@example.com`
     - Password: `password123`
     - Confirm Password: `password123`
   - Click "Register"
   - You should see a success message and be logged in

4. **Test Login:**
   - Click "Logout" first
   - Fill in:
     - Email: `test@example.com`
     - Password: `password123`
   - Click "Login"
   - You should be logged in successfully

### Test 2: Fetching Quests

1. After logging in, you should see a "Quests" section
2. The app will automatically fetch quests from the backend
3. If you have quests in your database, they will be displayed
4. If there are no quests, you'll see "No quests found"

### Test 3: Error Handling

1. **Test Invalid Credentials:**
   - Try logging in with wrong credentials
   - You should see an error message

2. **Test Unauthorized Access:**
   - Logout
   - The quests section should not be visible
   - Try accessing protected routes (they should fail with 401)

3. **Test Backend Connection:**
   - Stop your backend server
   - Try to login or fetch quests
   - You should see connection errors

## Browser Developer Tools

Open your browser's Developer Tools (F12) to monitor:

1. **Network Tab:**
   - Check API requests to `/api/v1/auth/login`, `/api/v1/auth/register`, `/api/v1/quests`
   - Verify request headers include `Authorization: Bearer <token>` for authenticated requests
   - Check response status codes (200 for success, 400/401 for errors)

2. **Console Tab:**
   - Check for any JavaScript errors
   - API errors will be logged here

3. **Application/Storage Tab:**
   - Check `localStorage` for:
     - `auth_token`: Your authentication token
     - `user`: User data (JSON string)
     - `auth-storage`: Zustand persisted state

## Testing API Directly

You can also test the API directly using curl or Postman:

### Register
```bash
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "password_confirmation": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Get Quests (requires token)
```bash
curl -X GET http://localhost:8000/api/v1/quests \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Common Issues

### 1. CORS Errors
**Problem:** Browser shows CORS errors in console
**Solution:** 
- Check `backend/config/sanctum.php` includes your frontend URL
- Make sure `SANCTUM_STATEFUL_DOMAINS` includes `localhost:5173`

### 2. 401 Unauthorized
**Problem:** Getting 401 errors even after login
**Solution:**
- Check that token is being stored in localStorage
- Verify token is being sent in Authorization header
- Check backend token validation

### 3. Connection Refused
**Problem:** Cannot connect to backend
**Solution:**
- Verify backend is running: `php artisan serve`
- Check the URL in `.env` matches your backend URL
- Check firewall/port settings

### 4. Response Structure Mismatch
**Problem:** Errors about response structure
**Solution:**
- Verify backend returns:
  ```json
  {
    "success": true,
    "data": [...],
    "message": "..."
  }
  ```
- Check `src/services/api.ts` handles the response correctly

## Next Steps

After testing:
1. Build your actual UI components
2. Replace test components with production components
3. Add routing (React Router)
4. Add form validation
5. Add loading states and better error handling

