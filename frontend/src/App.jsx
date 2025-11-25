import { Navigate, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import { useAuth } from './context/AuthContext';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const { user, initializing } = useAuth();

  if (initializing) {
    return <div className="page-loader">Checking session...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  const { user, initializing } = useAuth();

  // Show loading state while checking auth
  if (initializing) {
    return <div className="page-loader">Checking session...</div>;
  }

  return (
    <Routes>
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/login"
        element={user ? <Navigate to="/home" replace /> : <Login />}
      />
      <Route
        path="/signup"
        element={user ? <Navigate to="/home" replace /> : <Signup />}
      />
      <Route
        path="/"
        element={<Navigate to={user ? '/home' : '/login'} replace />}
      />
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}

export default App;
