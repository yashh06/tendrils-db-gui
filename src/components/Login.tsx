import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Database,
  User,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
} from "lucide-react";
import "./Login.css";

// Hardcoded credentials - change these as needed
const VALID_CREDENTIALS = {
  username: "admin@tendrils.io",
  password: "admin@123",
};

// Simple hash function to avoid storing plain text in sessionStorage
const hashCredentials = (username: string, password: string): string => {
  const str = `${username}:${password}:${VALID_CREDENTIALS.username}:${VALID_CREDENTIALS.password}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return `auth_${Math.abs(hash).toString(36)}_${Date.now().toString(36)}`;
};

// Validate the auth token
export const validateAuthToken = (): boolean => {
  const token = sessionStorage.getItem("authToken");
  const isAuthenticated = sessionStorage.getItem("isAuthenticated");
  const loginTime = sessionStorage.getItem("loginTime");
  
  if (!token || !isAuthenticated || !loginTime) {
    return false;
  }
  
  // Check if token format is valid
  if (!token.startsWith("auth_")) {
    return false;
  }
  
  // Check if session is not expired (24 hours)
  const loginTimestamp = parseInt(loginTime, 10);
  const now = Date.now();
  const twentyFourHours = 24 * 60 * 60 * 1000;
  
  if (isNaN(loginTimestamp) || (now - loginTimestamp) > twentyFourHours) {
    clearAuthSession();
    return false;
  }
  
  return isAuthenticated === "true";
};

// Clear all auth data
export const clearAuthSession = (): void => {
  sessionStorage.removeItem("isAuthenticated");
  sessionStorage.removeItem("authToken");
  sessionStorage.removeItem("user");
  sessionStorage.removeItem("loginTime");
};

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState(0);

  // Check if already authenticated
  useEffect(() => {
    if (validateAuthToken()) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  // Lockout timer
  useEffect(() => {
    if (isLocked && lockoutTime > 0) {
      const timer = setInterval(() => {
        setLockoutTime((prev) => {
          if (prev <= 1) {
            setIsLocked(false);
            setAttempts(0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isLocked, lockoutTime]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if locked out
    if (isLocked) {
      setError(`Too many attempts. Please wait ${lockoutTime} seconds.`);
      return;
    }
    
    setError("");
    setIsLoading(true);

    // Simulate a small delay for better UX and to prevent brute force
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Trim inputs to prevent whitespace bypass
    const trimmedUsername = username.trim().toLowerCase();
    const trimmedPassword = password.trim();

    // Validate inputs
    if (!trimmedUsername || !trimmedPassword) {
      setError("Please enter both username and password");
      setIsLoading(false);
      return;
    }

    // Check credentials
    if (
      trimmedUsername === VALID_CREDENTIALS.username.toLowerCase() &&
      trimmedPassword === VALID_CREDENTIALS.password
    ) {
      // Generate auth token
      const authToken = hashCredentials(trimmedUsername, trimmedPassword);
      
      // Store login state securely
      sessionStorage.setItem("isAuthenticated", "true");
      sessionStorage.setItem("authToken", authToken);
      sessionStorage.setItem("user", trimmedUsername);
      sessionStorage.setItem("loginTime", Date.now().toString());
      
      // Reset attempts
      setAttempts(0);
      
      navigate("/", { replace: true });
    } else {
      // Increment failed attempts
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      
      // Lock after 5 failed attempts
      if (newAttempts >= 5) {
        setIsLocked(true);
        setLockoutTime(30); // 30 seconds lockout
        setError("Too many failed attempts. Please wait 30 seconds.");
      } else {
        setError(`Invalid username or password. ${5 - newAttempts} attempts remaining.`);
      }
      
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Background Effects */}
      <div className="login-bg-orbs">
        <div className="login-orb login-orb-1"></div>
        <div className="login-orb login-orb-2"></div>
        <div className="login-orb login-orb-3"></div>
      </div>

      {/* Login Card */}
      <div className="login-card">
        <div className="login-card-glow"></div>

        {/* Header */}
        <div className="login-header">
          <div className="login-icon-wrapper">
            <Database className="login-icon" />
            <div className="login-icon-pulse"></div>
          </div>
          <h1 className="login-title">Product Dashboard</h1>
          <p className="login-subtitle">
            Sign in to access the inventory system
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="login-form">
          {/* Error Message */}
          {error && (
            <div className="login-error">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {/* Lockout Warning */}
          {isLocked && (
            <div className="login-lockout">
              <Lock size={18} />
              <span>Account locked. Try again in {lockoutTime}s</span>
            </div>
          )}

          {/* Username Field */}
          <div className="login-field">
            <label htmlFor="username" className="login-label">
              Username
            </label>
            <div className="login-input-wrapper">
              <div className="login-input-icon">
                <User size={18} />
              </div>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="login-input"
                required
                disabled={isLoading || isLocked}
                autoComplete="username"
                maxLength={100}
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="login-field">
            <label htmlFor="password" className="login-label">
              Password
            </label>
            <div className="login-input-wrapper">
              <div className="login-input-icon">
                <Lock size={18} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="login-input"
                required
                disabled={isLoading || isLocked}
                autoComplete="current-password"
                maxLength={100}
              />
              <button
                type="button"
                className="login-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                disabled={isLocked}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`login-submit-btn ${isLoading ? "loading" : ""} ${isLocked ? "locked" : ""}`}
            disabled={isLoading || isLocked}
          >
            {isLoading ? (
              <>
                <Loader2 className="login-spinner" size={20} />
                <span>Signing in...</span>
              </>
            ) : isLocked ? (
              <>
                <Lock size={20} />
                <span>Locked ({lockoutTime}s)</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="login-footer">
          <p>Protected System • Authorized Access Only</p>
        </div>
      </div>
    </div>
  );
}