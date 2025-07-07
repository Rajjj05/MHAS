import React from "react";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { Lock, MessageCircle } from "lucide-react";
import SignInButton from "./SignInButton";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-tranquil-50 via-warm-50 to-tranquil-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md w-full bg-white rounded-xl shadow-xl p-8 text-center"
        >
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Authentication Required
            </h2>
            <p className="text-gray-600">
              You need to sign in to access the chat functionality
            </p>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-center space-x-2 text-blue-600 mb-4">
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm font-medium">Secure Chat Access</span>
            </div>
            <p className="text-sm text-gray-500">
              Sign in with your Google account to start meaningful conversations
              with our AI assistants
            </p>
          </div>

          <SignInButton className="w-full" />

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Your conversations are private and secure
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
