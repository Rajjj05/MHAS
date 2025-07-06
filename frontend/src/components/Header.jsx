import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Heart, MessageCircle, Brain, Info, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SignInButton from "./SignInButton";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigationItems = [
    { name: "Mental Health Chat", path: "/mental-health", icon: Brain },
    { name: "Spiritual Guidance", path: "/spiritual", icon: Heart },
    { name: "About", path: "/about", icon: Info },
    { name: "Contact", path: "/contact", icon: Mail },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled || location.pathname !== "/"
          ? "bg-white/95 backdrop-blur-md shadow-soft border-b border-warm-200/30"
          : "bg-white/95 backdrop-blur-md shadow-soft border-b border-warm-200/30"
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-3 group"
            onClick={closeMenu}
          >
            <div className="relative">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-tranquil-400 to-tranquil-600 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                <Heart className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-lavender-400 to-lavender-600 rounded-full opacity-80 animate-pulse-gentle"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl md:text-2xl font-heading font-bold gradient-text">
                MindfulAI
              </span>
              <span className="text-xs text-mindful-600 font-medium -mt-1">
                Mental Wellness
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 relative ${
                  location.pathname === item.path
                    ? "text-tranquil-700 bg-tranquil-50"
                    : "text-mindful-700 hover:text-tranquil-700 hover:bg-warm-50"
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
                {location.pathname === item.path && (
                  <motion.div
                    className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-tranquil-500 rounded-full"
                    layoutId="activeNavItem"
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Sign In Button - Desktop */}
          <div className="hidden md:flex items-center">
            <SignInButton />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-xl text-mindful-700 hover:text-tranquil-700 hover:bg-warm-50 transition-all duration-300"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white/95 backdrop-blur-md border-t border-warm-200/30"
          >
            <div className="container-custom py-4 space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={closeMenu}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    location.pathname === item.path
                      ? "text-tranquil-700 bg-tranquil-50"
                      : "text-mindful-700 hover:text-tranquil-700 hover:bg-warm-50"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              ))}

              {/* Sign In Button - Mobile */}
              <div className="pt-4 border-t border-warm-200/30">
                <SignInButton />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
