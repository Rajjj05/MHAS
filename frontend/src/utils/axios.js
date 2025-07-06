import axios from "axios";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Token management utilities
const TokenManager = {
  getAccessToken: () => localStorage.getItem("accessToken"),
  getRefreshToken: () => localStorage.getItem("refreshToken"),
  setTokens: (accessToken, refreshToken) => {
    localStorage.setItem("accessToken", accessToken);
    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    }
  },
  clearTokens: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  },
  isTokenExpired: (token) => {
    if (!token) return true;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch (error) {
      return true;
    }
  },
};

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = TokenManager.getAccessToken();

    if (token && !TokenManager.isTokenExpired(token)) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh and errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = TokenManager.getRefreshToken();

        if (refreshToken && !TokenManager.isTokenExpired(refreshToken)) {
          // Note: Refresh endpoint not implemented in backend yet
          // TODO: Implement refresh endpoint or remove refresh token logic
          throw new Error("Refresh token functionality not implemented");

          // Commented out until backend refresh endpoint is implemented
          // const response = await axios.post(
          //   `${api.defaults.baseURL}/users/refresh`,
          //   { refreshToken },
          //   {
          //     headers: { "Content-Type": "application/json" },
          //   }
          // );

          // Commented out until backend refresh endpoint is implemented
          // const { accessToken, refreshToken: newRefreshToken } = response.data;

          // // Update stored tokens
          // TokenManager.setTokens(accessToken, newRefreshToken);

          // // Update the authorization header for the original request
          // originalRequest.headers.Authorization = `Bearer ${accessToken}`;

          // // Retry the original request
          // return api(originalRequest);
        } else {
          // Refresh token is invalid or expired
          throw new Error("Refresh token expired");
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        console.error("Token refresh failed:", refreshError);
        TokenManager.clearTokens();

        // Dispatch custom event for auth state change
        window.dispatchEvent(new CustomEvent("auth:logout"));

        // Redirect to home page
        if (window.location.pathname !== "/") {
          window.location.href = "/";
        }

        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    if (error.response?.status === 403) {
      console.error("Access forbidden:", error.response.data);
    } else if (error.response?.status >= 500) {
      console.error("Server error:", error.response.data);
    } else if (error.code === "ECONNABORTED") {
      console.error("Request timeout");
    } else if (!error.response) {
      console.error("Network error - server might be down");
    }

    return Promise.reject(error);
  }
);

// Utility function to make authenticated requests
export const makeAuthenticatedRequest = async (requestConfig) => {
  try {
    const response = await api(requestConfig);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Utility function to check if user is authenticated
export const isAuthenticated = () => {
  const token = TokenManager.getAccessToken();
  return token && !TokenManager.isTokenExpired(token);
};

// Export token manager for use in other files
export { TokenManager };

export default api;
