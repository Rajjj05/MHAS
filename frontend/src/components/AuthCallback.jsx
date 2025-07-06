import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { handleAuthCallback } = useAuth();
  const [error, setError] = useState(null);

  useEffect(() => {
    const processCallback = async () => {
      try {
        // Extract tokens and user data from URL params
        const accessToken =
          searchParams.get("token") || searchParams.get("accessToken");
        const refreshToken = searchParams.get("refreshToken");
        const userStr = searchParams.get("user");
        const errorParam = searchParams.get("error");

        if (errorParam) {
          setError(`Authentication failed: ${errorParam}`);
          setTimeout(() => navigate("/", { replace: true }), 3000);
          return;
        }

        if (!accessToken || !userStr) {
          setError("Missing authentication data");
          setTimeout(() => navigate("/", { replace: true }), 3000);
          return;
        }

        // Parse user data
        const userData = JSON.parse(decodeURIComponent(userStr));

        // Handle the authentication callback
        await handleAuthCallback(accessToken, refreshToken, userData);

        // Always redirect to homepage after successful authentication
        localStorage.removeItem("redirectAfterAuth");

        // Success! Redirect to homepage
        navigate("/", { replace: true });
      } catch (error) {
        console.error("Error processing auth callback:", error);
        setError("Authentication processing failed");
        setTimeout(() => navigate("/", { replace: true }), 3000);
      }
    };

    processCallback();
  }, [searchParams, navigate, handleAuthCallback]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L3.316 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              Authentication Error
            </h3>
            <p className="mt-1 text-sm text-gray-500">{error}</p>
            <p className="mt-2 text-xs text-gray-400">
              Redirecting to home page...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
            <svg
              className="animate-spin h-6 w-6 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            Signing you in...
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Please wait while we complete your authentication.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthCallback;
