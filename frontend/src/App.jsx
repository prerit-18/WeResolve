import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import CitizenDashboardApp from './citizen/CitizenDashboardApp';
import SolverDashboardApp from './solver/SolverDashboardApp';
import AdminDashboardApp from './admin/AdminDashboardApp';

// Protected Route Component
function ProtectedRoute({ children, allowedRole }) {
  const token = localStorage.getItem('token');
  const userString = localStorage.getItem('user');

  if (!token || !userString) {
    return <Navigate to="/login" replace />;
  }

  const user = JSON.parse(userString);

  if (allowedRole && user.role !== allowedRole) {
    // Redirect to correct dashboard
    if (user.role === 'citizen') return <Navigate to="/citizen/dashboard" replace />;
    if (user.role === 'solver') return <Navigate to="/solver/dashboard" replace />;
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Role-Specific Protected Dashboard Routes */}
        <Route
          path="/citizen/dashboard"
          element={
            <ProtectedRoute allowedRole="citizen">
              <CitizenDashboardApp />
            </ProtectedRoute>
          }
        />
        <Route
          path="/solver/dashboard"
          element={
            <ProtectedRoute allowedRole="solver">
              <SolverDashboardApp />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboardApp />
            </ProtectedRoute>
          }
        />

        {/* Catch-all Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
