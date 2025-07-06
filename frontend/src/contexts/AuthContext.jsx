import React, { createContext, useContext, useState, useEffect } from "react";
import authService from "../services/AuthService";
import { TokenManager } from "../utils/axios";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    initializeAuth();

    // Listen for logout events from other tabs or axios interceptor
    const handleLogout = () => {
      setUser(null);
      setError(null);
    };

    window.addEventListener("auth:logout", handleLogout);

    return () => {
      window.removeEventListener("auth:logout", handleLogout);
    };
  }, []);

  const initializeAuth = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if there are auth tokens in the URL (from OAuth callback)
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");
      const userParam = urlParams.get("user");

      if (token && userParam) {
        try {
          // Process OAuth callback tokens
          const userData = JSON.parse(decodeURIComponent(userParam));
          await handleAuthCallback(token, null, userData);

          // Clean up URL by removing auth parameters
          const newUrl = window.location.pathname;
          window.history.replaceState(null, "", newUrl);
          return;
        } catch (error) {
          console.error("Error processing auth tokens from URL:", error);
          // Continue with normal auth check
        }
      }

      if (authService.isAuthenticated()) {
        const currentUser = authService.getCurrentUser();

        if (currentUser) {
          // Validate session with backend
          const isValid = await authService.validateSession();

          if (isValid) {
            setUser(currentUser);
          } else {
            // Session invalid, clear data
            TokenManager.clearTokens();
            setUser(null);
          }
        } else {
          // No user data, clear tokens
          TokenManager.clearTokens();
          setUser(null);
        }
      }
    } catch (error) {
      console.error("Error initializing auth:", error);
      setError("Failed to initialize authentication");
      TokenManager.clearTokens();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async () => {
    try {
      setError(null);
      setLoading(true);
      await authService.signInWithGoogle();
    } catch (error) {
      console.error("Sign in error:", error);
      setError("Failed to sign in with Google");
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      await authService.signOut();
      setUser(null);
    } catch (error) {
      console.error("Sign out error:", error);
      setError("Failed to sign out");
      // Still clear user state locally even if server request fails
      setUser(null);
    }
  };

  const handleAuthCallback = async (token, refreshToken, userData) => {
    try {
      setLoading(true);
      setError(null);

      const user = await authService.handleAuthCallback(
        token,
        refreshToken,
        userData
      );
      setUser(user);

      return user;
    } catch (error) {
      console.error("Auth callback error:", error);
      setError("Authentication failed");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      if (authService.isAuthenticated()) {
        const userProfile = await authService.getUserProfile();
        setUser(userProfile);
        localStorage.setItem("user", JSON.stringify(userProfile));
      }
    } catch (error) {
      console.error("Error refreshing user:", error);
      setError("Failed to refresh user data");
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    signIn,
    signOut,
    handleAuthCallback,
    refreshUser,
    clearError,
    isAuthenticated: !!user && authService.isAuthenticated(),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
