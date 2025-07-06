import React from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  Brain,
  Users,
  Sparkles,
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Platform: [
      { name: "Mental Health Chat", href: "/mental-health", icon: Brain },
      { name: "Spiritual Chat", href: "/spiritual", icon: Sparkles },
      { name: "Chat History", href: "/history", icon: MessageCircle },
      { name: "Home", href: "/", icon: Heart },
    ],
    Support: [
      { name: "About Us", href: "/about", icon: Users },
      { name: "Contact", href: "/contact", icon: Mail },
    ],
  };

  return (
    <footer className="mt-auto bg-gradient-to-br from-mindful-900 to-tranquil-800 text-white">
      <div className="container-custom">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <Link to="/" className="flex items-center space-x-3 mb-6 group">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-tranquil-400 to-tranquil-600 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-lavender-400 to-lavender-600 rounded-full opacity-80 animate-pulse-gentle"></div>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-heading font-bold">
                    Serenity
                  </span>
                  <span className="text-sm text-white/70 -mt-1">
                    AI Wellness
                  </span>
                </div>
              </Link>
              <p className="text-white/80 mb-6 leading-relaxed">
                Your AI-powered companion for mental health and spiritual
                wellness. Find support, guidance, and peace through personalized
                conversations with our compassionate AI.
              </p>
              <div className="flex items-center space-x-2 text-sm text-white/70">
                <Brain className="w-4 h-4" />
                <span>Powered by Ethical AI</span>
              </div>
            </div>

            {/* Footer Links */}
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h3 className="text-lg font-heading font-semibold mb-6">
                  {category}
                </h3>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.href}
                        className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors duration-300 group"
                      >
                        <link.icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        <span>{link.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Info */}
        <div className="py-8 border-t border-white/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-tranquil-500/20 rounded-xl flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-tranquil-300" />
              </div>
              <div>
                <p className="text-sm text-white/70">AI Support</p>
                <p className="text-white font-medium">24/7 Available</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-tranquil-500/20 rounded-xl flex items-center justify-center">
                <Mail className="w-5 h-5 text-tranquil-300" />
              </div>
              <div>
                <p className="text-sm text-white/70">Get in Touch</p>
                <Link
                  to="/contact"
                  className="text-white font-medium hover:text-tranquil-300 transition-colors"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="py-6 border-t border-white/20">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/70 text-sm">
              © {currentYear} Serenity AI. Compassionate AI for mental health
              and spiritual wellness.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <div className="flex items-center space-x-2 text-sm text-white/70">
                <Heart className="w-4 h-4 text-tranquil-300" />
                <span>Made with care for your wellbeing</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
