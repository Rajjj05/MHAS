import api, { TokenManager, makeAuthenticatedRequest } from "../utils/axios";

class AuthService {
  // Initiate Google OAuth flow
  async signInWithGoogle() {
    try {
      // Store the current page URL to redirect back after auth
      localStorage.setItem("redirectAfterAuth", window.location.pathname);

      // Check if we're in development mode and backend is not available

      // Redirect to backend Google OAuth endpoint
      window.location.href = `${api.defaults.baseURL}/users/auth/google`;
    } catch (error) {
      console.error("Error initiating Google sign-in:", error);
      throw new Error("Failed to initiate Google sign-in");
    }
  }

  // Handle OAuth callback and extract tokens
  async handleAuthCallback(token, refreshToken, user) {
    try {
      if (!token || !user) {
        throw new Error("Invalid authentication response");
      }

      // Store tokens and user data
      TokenManager.setTokens(token, refreshToken);
      localStorage.setItem("user", JSON.stringify(user));

      // Return the user data directly instead of making another API call
      return user;
    } catch (error) {
      console.error("Error handling auth callback:", error);
      TokenManager.clearTokens();
      throw error;
    }
  }

  // Get user profile from backend using JWT
  async getUserProfile() {
    try {
      const response = await makeAuthenticatedRequest({
        method: "GET",
        url: "/users/profile",
      });
      return response;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw new Error("Failed to fetch user profile");
    }
  }

  // Sign out user
  async signOut() {
    try {
      const refreshToken = TokenManager.getRefreshToken();

      if (refreshToken) {
        // Notify backend to invalidate the refresh token
        await api.post("/users/logout", {
          refreshToken,
        });
      }
    } catch (error) {
      console.error("Error during logout API call:", error);
      // Continue with local cleanup even if API call fails
    } finally {
      // Always clear local storage
      TokenManager.clearTokens();

      // Dispatch logout event
      window.dispatchEvent(new CustomEvent("auth:logout"));

      // Redirect to home page
      if (window.location.pathname !== "/") {
        window.location.href = "/";
      }
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = TokenManager.getAccessToken();
    const user = localStorage.getItem("user");

    return token && user && !TokenManager.isTokenExpired(token);
  }

  // Get stored user data
  getCurrentUser() {
    try {
      const userStr = localStorage.getItem("user");
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error("Error parsing user data:", error);
      return null;
    }
  }

  // Validate current session
  async validateSession() {
    try {
      if (!this.isAuthenticated()) {
        return false;
      }

      // For now, just check if we have valid tokens and user data
      // In the future, you can add a backend endpoint to validate the session
      const token = TokenManager.getAccessToken();
      const user = this.getCurrentUser();

      return !!(token && user && !TokenManager.isTokenExpired(token));
    } catch (error) {
      console.error("Session validation failed:", error);
      TokenManager.clearTokens();
      return false;
    }
  }
}

export default new AuthService();
