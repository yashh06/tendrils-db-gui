import { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login, { validateAuthToken, clearAuthSession } from "./components/Login";
const queryClient = new QueryClient();

// Protected Route wrapper component with strict validation
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  
  // Validate auth on every render
  const isAuthenticated = validateAuthToken();
  
  if (!isAuthenticated) {
    // Clear any potentially tampered session data
    clearAuthSession();
    // Redirect to login with return URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return <>{children}</>;
};

// Wrapper component to handle logout with navigation
function IndexWithLogout() {
  const navigate = useNavigate();
  const [isValid, setIsValid] = useState(true);
  
  // Continuously validate auth
  useEffect(() => {
    const checkAuth = () => {
      if (!validateAuthToken()) {
        setIsValid(false);
        clearAuthSession();
        navigate("/login", { replace: true });
      }
    };
    
    // Check immediately
    checkAuth();
    
    // Check periodically (every 30 seconds)
    const interval = setInterval(checkAuth, 30000);
    
    // Check on visibility change (when user returns to tab)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        checkAuth();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [navigate]);
  
  const handleLogout = () => {
    clearAuthSession();
    navigate("/login", { replace: true });
  };
  
  if (!isValid) {
    return null;
  }
  
  return <Index onLogout={handleLogout} />;
}

// Login route wrapper - redirect if already authenticated
const LoginRoute = () => {
  if (validateAuthToken()) {
    return <Navigate to="/" replace />;
  }
  return <Login />;
};

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initial auth check
    const timer = setTimeout(() => setIsLoading(false), 100);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="app-loading">
        <div className="app-loading-spinner"></div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename="/tendrils-db-gui">
        <Routes>
          <Route path="/login" element={<LoginRoute />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <IndexWithLogout />
              </ProtectedRoute>
            }
          />
          {/* Catch all - redirect to login if not authenticated, otherwise 404 */}
          <Route 
            path="*" 
            element={
              validateAuthToken() ? <NotFound /> : <Navigate to="/login" replace />
            } 
          />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;