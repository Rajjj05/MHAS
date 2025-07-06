import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useChat } from "../contexts/ChatContext";
import { MessageCircle, Clock, ArrowLeft } from "lucide-react";

const History = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { chatHistory, loading, error, getChatHistory, continueChat } =
    useChat();

  // Load initial data
  useEffect(() => {
    if (isAuthenticated) {
      getChatHistory();
    }
  }, [isAuthenticated, getChatHistory]);

  const handleContinueChat = async (chatId, chatType) => {
    try {
      await continueChat(chatId);
      // Navigate to appropriate chat page
      if (chatType === "mental-health") {
        navigate("/mental-health");
      } else if (chatType === "spiritual") {
        navigate("/spiritual");
      } else {
        navigate("/mental-health"); // Default fallback
      }
    } catch (error) {
      console.error("Error continuing chat:", error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getChatTypeLabel = (chatType) => {
    switch (chatType) {
      case "mental-health":
        return "Mental Health";
      case "spiritual":
        return "Spiritual";
      default:
        return "General";
    }
  };

  const getChatTypeColor = (chatType) => {
    switch (chatType) {
      case "mental-health":
        return "text-tranquil-600 bg-tranquil-50 border-tranquil-200";
      case "spiritual":
        return "text-lavender-600 bg-lavender-50 border-lavender-200";
      default:
        return "text-mindful-600 bg-mindful-50 border-mindful-200";
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-16 sm:pt-20 bg-gradient-to-br from-tranquil-50 via-warm-50 to-tranquil-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Access Denied
          </h2>
          <p className="text-gray-600">
            Please sign in to view your chat history.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 sm:pt-20 bg-gradient-to-br from-tranquil-50 via-warm-50 to-tranquil-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 text-gray-600 hover:text-tranquil-600 hover:bg-white/80 rounded-lg transition-colors backdrop-blur-sm"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-tranquil-600 via-tranquil-600 to-lavender-600 bg-clip-text text-transparent">
                Chat History
              </h1>
              <p className="text-gray-600 mt-1">
                View your previous conversations
              </p>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tranquil-600"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-xl p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Chat History List */}
        {!loading && !error && (
          <div className="space-y-6">
            {chatHistory.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-warm">
                  <MessageCircle className="w-16 h-16 text-tranquil-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No conversations yet
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Start a new chat to see your history here.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={() => navigate("/mental-health")}
                      className="btn-primary"
                    >
                      Mental Health Chat
                    </button>
                    <button
                      onClick={() => navigate("/spiritual")}
                      className="btn-secondary"
                    >
                      Spiritual Chat
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              chatHistory.map((chat, index) => (
                <motion.div
                  key={chat._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/80 hover:shadow-warm transition-all duration-300 cursor-pointer group"
                  onClick={() => handleContinueChat(chat._id, chat.chatType)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-3">
                        <span
                          className={`px-3 py-1 text-sm font-medium rounded-full border transition-colors ${getChatTypeColor(
                            chat.chatType
                          )}`}
                        >
                          {getChatTypeLabel(chat.chatType)}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3 truncate group-hover:text-tranquil-700 transition-colors">
                        {chat.title}
                      </h3>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>{formatDate(chat.createdAt)}</span>
                      </div>
                    </div>
                    <div className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-tranquil-500 text-white p-2 rounded-lg">
                        <ArrowLeft className="w-4 h-4 rotate-180" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
