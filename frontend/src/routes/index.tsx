import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import PublicRoute from '../components/PublicRoute';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Quests from '../pages/Quests';
import QuestDetail from '../pages/QuestDetail';
import CreateQuest from '../pages/CreateQuest';
import NotFound from '../pages/NotFound';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public routes - redirect to home if already authenticated */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      {/* Protected routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/quests"
        element={
          <ProtectedRoute>
            <Quests />
          </ProtectedRoute>
        }
      />
      <Route
        path="/quests/create"
        element={
          <ProtectedRoute>
            <CreateQuest />
          </ProtectedRoute>
        }
      />
      <Route
        path="/quests/:id"
        element={
          <ProtectedRoute>
            <QuestDetail />
          </ProtectedRoute>
        }
      />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

