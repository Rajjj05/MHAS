import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaGoogle,
  FaUser,
  FaChevronDown,
  FaSignOutAlt,
  FaHistory,
} from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const SignInButton = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { user, loading, signIn, signOut, isAuthenticated, error } = useAuth();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignIn = async () => {
    try {
      await signIn();
    } catch (error) {
      console.error("Sign in failed:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setShowDropdown(false);
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleHistoryClick = () => {
    navigate("/history");
    setShowDropdown(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center w-8 h-8">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-tranquil-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <motion.button
        onClick={handleSignIn}
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-warm-200/50 rounded-xl shadow-soft hover:shadow-warm transition-all duration-300 text-tranquil-700 hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-tranquil-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        whileHover={{ scale: loading ? 1 : 1.02 }}
        whileTap={{ scale: loading ? 1 : 0.98 }}
      >
        <FaGoogle className="text-red-500" />
        <span className="hidden sm:inline font-medium">
          {loading ? "Signing in..." : "Sign in with Google"}
        </span>
        <span className="sm:hidden font-medium">
          {loading ? "Signing in..." : "Sign in"}
        </span>
      </motion.button>
    );
  }

  const getInitials = (name) => {
    return name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2)
      : "U";
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        onClick={toggleDropdown}
        className="flex items-center gap-2 px-3 py-2 bg-white/60 backdrop-blur-sm border border-warm-200/30 rounded-xl hover:bg-white/80 hover:shadow-warm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-tranquil-500 focus:ring-offset-2"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* User Avatar */}
        <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-tranquil-400 to-tranquil-600 flex items-center justify-center shadow-soft">
          {user?.picture ? (
            <img
              src={user.picture}
              alt={user.name || "User"}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
            />
          ) : null}
          <div
            className={`w-full h-full bg-gradient-to-br from-tranquil-400 to-tranquil-600 flex items-center justify-center text-white text-sm font-medium ${
              user?.picture ? "hidden" : "flex"
            }`}
          >
            {getInitials(user?.name)}
          </div>
        </div>

        {/* User Name (hidden on mobile) */}
        <span className="hidden md:inline text-tranquil-700 font-medium truncate max-w-32">
          {user?.name || "User"}
        </span>

        {/* Dropdown Arrow */}
        <motion.div
          animate={{ rotate: showDropdown ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <FaChevronDown className="w-3 h-3 text-tranquil-500" />
        </motion.div>
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-64 bg-white/90 backdrop-blur-sm rounded-2xl shadow-warm border border-warm-200/30 py-2 z-50"
          >
            {/* User Info Section */}
            <div className="px-4 py-3 border-b border-warm-200/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-tranquil-400 to-tranquil-600 flex items-center justify-center flex-shrink-0 shadow-soft">
                  {user?.picture ? (
                    <img
                      src={user.picture}
                      alt={user.name || "User"}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                  ) : null}
                  <div
                    className={`w-full h-full bg-gradient-to-br from-tranquil-400 to-tranquil-600 flex items-center justify-center text-white text-sm font-medium ${
                      user?.picture ? "hidden" : "flex"
                    }`}
                  >
                    {getInitials(user?.name)}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-tranquil-700 truncate">
                    {user?.name || "User"}
                  </p>
                  <p className="text-sm text-mindful-600 truncate">
                    {user?.email || "No email"}
                  </p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-1">
              {/* History Button */}
              <button
                onClick={handleHistoryClick}
                className="w-full px-4 py-2 text-left text-sm text-tranquil-700 hover:bg-warm-100/70 transition-colors duration-200 flex items-center gap-2"
              >
                <FaHistory className="w-4 h-4 text-tranquil-500" />
                Chat History
              </button>
            </div>

            {/* Divider */}
            <div className="border-t border-warm-200/30"></div>

            {/* Sign Out Button */}
            <button
              onClick={handleSignOut}
              className="w-full px-4 py-2 text-left text-sm text-tranquil-700 hover:bg-warm-100/70 transition-colors duration-200 flex items-center gap-2"
            >
              <FaSignOutAlt className="w-4 h-4 text-tranquil-500" />
              Sign out
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Message */}
      {error && (
        <div className="absolute top-full right-0 mt-2 p-2 bg-red-50/90 backdrop-blur-sm border border-red-200 rounded-xl shadow-soft z-50">
          <p className="text-xs text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
};

export default SignInButton;
