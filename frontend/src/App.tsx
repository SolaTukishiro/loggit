import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import AppLayout from './components/layout/AppLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProjectList from './pages/ProjectList';
import ProjectDetail from './pages/ProjectDetail';
import ActivityLog from './pages/ActivityLog';
import TaskList from './pages/TaskList';
import Settings from './pages/Settings';

const App = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <Routes>
            <Route path="/login"    element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<AppLayout />}>
              <Route path="/"              element={<Dashboard />} />
              <Route path="/projects"      element={<ProjectList />} />
              <Route path="/projects/:id"  element={<ProjectDetail />} />
              <Route path="/tasks"         element={<TaskList />} />
              <Route path="/activity-logs" element={<ActivityLog />} />
              <Route path="/settings"      element={<Settings />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;