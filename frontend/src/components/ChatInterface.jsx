import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { useChat } from "../contexts/ChatContext";
import {
  Send,
  Bot,
  User,
  Trash2,
  Clock,
  AlertTriangle,
  ArrowDown,
  MessageCircle,
} from "lucide-react";

const ChatInterface = ({
  title,
  subtitle,
  initialMessage,
  disclaimer,
  emergencyInfo,
  aiContext = "general",
}) => {
  const { user } = useAuth();
  const {
    currentChat,
    createChat,
    sendMessage,
    loading,
    error,
    clearCurrentChat,
    clearError,
  } = useChat();

  const [inputMessage, setInputMessage] = useState("");
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [firstExchangeComplete, setFirstExchangeComplete] = useState(false);
  const [animatedMessageIds, setAnimatedMessageIds] = useState(
    new Set(["initial", "welcome"])
  );
  const [localMessages, setLocalMessages] = useState([
    {
      id: "initial",
      role: "assistant",
      content: initialMessage,
      timestamp: new Date(),
    },
  ]);

  const prevMessageCountRef = useRef(1);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);

  // Get messages from current chat or use local messages
  const messages = currentChat
    ? [
        // Always include the welcome message as the first message
        {
          id: "welcome",
          type: "ai",
          content: initialMessage,
          timestamp: new Date(), // Use current time for consistency
        },
        // Then add all the actual chat messages
        ...currentChat.messages.map((msg, index) => ({
          id: `msg-${index}-${msg.role}-${msg.content
            .slice(0, 30)
            .replace(/\s/g, "")}`, // Stable ID based on position, role, and content
          type: msg.role === "user" ? "user" : "ai",
          content: msg.content,
          timestamp: new Date(msg.timestamp),
        })),
      ]
    : localMessages.map((msg, index) => ({
        id: msg.id || `local-${index}`,
        type: msg.role === "user" ? "user" : "ai",
        content: msg.content,
        timestamp: msg.timestamp,
      }));

  // Update initial message when it changes
  useEffect(() => {
    if (!currentChat) {
      setLocalMessages([
        {
          id: "initial",
          role: "assistant",
          content: initialMessage,
          timestamp: new Date(),
        },
      ]);
    }
  }, [initialMessage, currentChat]);

  // Clear current chat when component unmounts or context changes
  useEffect(() => {
    return () => {
      if (currentChat) {
        clearCurrentChat();
      }
    };
  }, [aiContext]);

  // Handle scroll within message container
  const handleMessageScroll = (e) => {
    if (!messagesContainerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } =
      messagesContainerRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;

    setShowScrollToBottom(!isAtBottom && messages.length > 1);
  };

  // Smooth scroll to bottom function
  const scrollToBottom = (force = false) => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  // Auto-scroll for new messages when user is near bottom and has interacted
  useEffect(() => {
    // Track which messages have been animated
    const currentMessageIds = new Set(messages.map((msg) => msg.id));
    const newMessageIds = new Set();

    messages.forEach((msg) => {
      if (!animatedMessageIds.has(msg.id)) {
        newMessageIds.add(msg.id);
      }
    });

    if (newMessageIds.size > 0) {
      setAnimatedMessageIds((prev) => new Set([...prev, ...newMessageIds]));
    }

    // Auto-scroll when new messages are added
    if (messages.length > prevMessageCountRef.current && hasUserInteracted) {
      const lastMessage = messages[messages.length - 1];

      // Auto-scroll for both user and AI messages when user has interacted
      setTimeout(() => {
        if (messagesContainerRef.current) {
          const { scrollTop, scrollHeight, clientHeight } =
            messagesContainerRef.current;
          // Auto-scroll if user is close to bottom (within 100px)
          const isCloseToBottom = scrollHeight - scrollTop - clientHeight < 100;

          if (isCloseToBottom || lastMessage.type === "user") {
            // Always scroll for user messages, conditionally for AI messages
            scrollToBottom();
          }
        }
      }, 100);
    }

    // Mark first exchange as complete after first user message and AI response
    // With welcome message, we need at least 3 messages (welcome + user + AI)
    if (messages.length >= 3 && !firstExchangeComplete) {
      setFirstExchangeComplete(true);
    }

    // Update the previous message count
    prevMessageCountRef.current = messages.length;
  }, [messages, hasUserInteracted, firstExchangeComplete, animatedMessageIds]);

  // Maintain input focus after sending, but don't focus on initial load
  useEffect(() => {
    // Only focus the input after user interaction, not on initial page load
    if (!loading && inputRef.current && hasUserInteracted) {
      inputRef.current.focus();
    }
  }, [loading, hasUserInteracted]);

  // Prevent any initial auto-scrolling on component mount
  useEffect(() => {
    // Ensure the page stays at top when component mounts
    if (messagesContainerRef.current) {
      // Reset scroll position to top of chat container without animation
      messagesContainerRef.current.scrollTop = 0;
    }
  }, []); // Only run on mount

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!inputMessage.trim() || loading) return;

    // Check if user is authenticated
    if (!user) {
      alert("Please sign in to start chatting");
      return;
    }

    // Mark that user has interacted with the chat
    setHasUserInteracted(true);

    const messageToSend = inputMessage;
    setInputMessage(""); // Clear input immediately for better UX

    try {
      if (!currentChat) {
        // Create new chat with first message
        await createChat(messageToSend, aiContext);
      } else {
        // Send message to existing chat
        await sendMessage(messageToSend);
      }

      clearError();
    } catch (err) {
      console.error("Error sending message:", err);
      // If there's an error, restore the message to the input
      setInputMessage(messageToSend);
      // Error is handled in the context
    }
  };

  const clearChat = () => {
    clearCurrentChat();
    setLocalMessages([
      {
        id: "initial",
        role: "assistant",
        content: initialMessage,
        timestamp: new Date(),
      },
    ]);
    setShowScrollToBottom(false);
    setHasUserInteracted(false);
    setFirstExchangeComplete(false);
    setAnimatedMessageIds(new Set(["initial", "welcome"]));
    prevMessageCountRef.current = 1;
    clearError();
  };

  const handleScrollToBottom = () => {
    scrollToBottom(true);
    setShowScrollToBottom(false);
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen pt-16 sm:pt-20 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-1 sm:px-4 py-2 sm:py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-3 sm:mb-8"
          >
            <h1 className="text-xl sm:text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-1 sm:mb-4 px-2 sm:px-4 leading-tight">
              {title}
            </h1>
            <p className="text-sm sm:text-lg text-gray-600 mb-3 sm:mb-6 px-2 sm:px-4 leading-relaxed">
              {subtitle}
            </p>

            {/* Disclaimer */}
            {disclaimer && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 sm:p-4 mb-3 sm:mb-6 max-w-4xl mx-1 sm:mx-auto">
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <AlertTriangle className="w-3 h-3 sm:w-5 sm:h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs sm:text-sm text-yellow-800 leading-relaxed text-left">
                    {disclaimer}
                  </p>
                </div>
              </div>
            )}

            {/* Emergency Info */}
            {emergencyInfo && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-2 sm:p-4 mb-3 sm:mb-6 max-w-4xl mx-1 sm:mx-auto">
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <AlertTriangle className="w-3 h-3 sm:w-5 sm:h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div className="text-left">
                    <p className="text-xs sm:text-sm font-semibold text-red-800 mb-1 sm:mb-2">
                      Emergency Support
                    </p>
                    <p className="text-xs sm:text-sm text-red-700 leading-relaxed">
                      {emergencyInfo}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-2 sm:p-4 mb-3 sm:mb-6 max-w-4xl mx-1 sm:mx-auto">
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <AlertTriangle className="w-3 h-3 sm:w-5 sm:h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div className="text-left">
                    <p className="text-xs sm:text-sm font-semibold text-red-800 mb-1 sm:mb-2">
                      Error
                    </p>
                    <p className="text-xs sm:text-sm text-red-700 leading-relaxed">
                      {error}
                    </p>
                    <button
                      onClick={clearError}
                      className="mt-1 sm:mt-2 text-xs text-red-600 hover:text-red-800 underline"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Enhanced Chat Container */}
          <div className="flex justify-center px-1 sm:px-4">
            <div
              className="w-full max-w-4xl h-[calc(100vh-200px)] sm:h-[70vh] min-h-[500px] sm:min-h-[600px] max-h-[800px] bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-2xl flex flex-col backdrop-blur-sm bg-white/95"
              style={{ zIndex: 10 }}
            >
              {/* Enhanced Chat Header */}
              <div className="flex items-center justify-between p-3 sm:p-6 border-b border-gray-100 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-t-xl sm:rounded-t-2xl">
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center ring-2 ring-white/30">
                    <Bot className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm sm:text-lg truncate">
                      AI Assistant
                    </p>
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full animate-pulse"></div>
                      <p className="text-xs sm:text-sm text-blue-100 truncate">
                        Online & Ready to Help
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={clearChat}
                  className="p-1.5 sm:p-2 hover:bg-white/20 rounded-lg sm:rounded-xl transition-all duration-200 hover:scale-105 flex-shrink-0"
                  title="Clear chat"
                >
                  <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>

              {/* Enhanced Messages Area */}
              <div
                ref={messagesContainerRef}
                onScroll={handleMessageScroll}
                className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-3 sm:space-y-6 bg-gradient-to-b from-gray-50/50 to-white"
                style={{
                  scrollBehavior: "smooth",
                  overflowY: "auto",
                }}
              >
                <AnimatePresence mode="popLayout">
                  {messages.map((message) => {
                    const isNewMessage = !animatedMessageIds.has(message.id);

                    return (
                      <motion.div
                        key={message.id}
                        layout
                        initial={isNewMessage ? { opacity: 0, y: 20 } : false}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{
                          duration: isNewMessage ? 0.3 : 0,
                          layout: { duration: 0.2 },
                        }}
                        className={`flex ${
                          message.type === "user"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`flex items-start space-x-2 sm:space-x-4 max-w-[90%] sm:max-w-[85%] md:max-w-[75%] lg:max-w-[70%] ${
                            message.type === "user"
                              ? "flex-row-reverse space-x-reverse ml-auto"
                              : "mr-auto"
                          }`}
                        >
                          <div
                            className={`w-6 h-6 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg ${
                              message.type === "user"
                                ? "bg-gradient-to-r from-blue-500 to-blue-600"
                                : "bg-gradient-to-r from-gray-600 to-gray-700"
                            }`}
                          >
                            {message.type === "user" ? (
                              <User className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
                            ) : (
                              <Bot className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
                            )}
                          </div>
                          <div
                            className={`rounded-xl sm:rounded-2xl px-3 py-2 sm:px-5 sm:py-4 shadow-md backdrop-blur-sm relative ${
                              message.type === "user"
                                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-blue-200"
                                : "bg-white/90 text-gray-900 shadow-gray-200 border border-gray-100"
                            }`}
                          >
                            <p className="text-xs sm:text-sm leading-relaxed font-medium break-words">
                              {message.content}
                            </p>
                            <div
                              className={`flex items-center mt-1 sm:mt-3 text-xs ${
                                message.type === "user"
                                  ? "text-blue-100"
                                  : "text-gray-500"
                              }`}
                            >
                              <Clock className="w-2 h-2 sm:w-3 sm:h-3 mr-1 sm:mr-1.5" />
                              <span className="text-xs">
                                {formatTime(message.timestamp)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {/* Enhanced Typing Indicator */}
                {loading && (
                  <motion.div
                    key="typing-indicator"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex justify-start mr-auto"
                  >
                    <div className="flex items-start space-x-2 sm:space-x-4">
                      <div className="w-6 h-6 sm:w-10 sm:h-10 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full flex items-center justify-center shadow-lg">
                        <Bot className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <div className="bg-white/90 border border-gray-100 rounded-xl sm:rounded-2xl px-3 py-2 sm:px-5 sm:py-4 shadow-md">
                        <div className="flex space-x-1 sm:space-x-1.5">
                          <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-gray-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Scroll to Bottom Button */}
              <AnimatePresence>
                {showScrollToBottom && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={handleScrollToBottom}
                    className="absolute bottom-16 sm:bottom-24 right-4 sm:right-8 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 backdrop-blur-sm"
                    style={{ zIndex: 20 }}
                    title="Scroll to bottom"
                  >
                    <ArrowDown className="w-4 h-4 sm:w-5 sm:h-5" />
                  </motion.button>
                )}
              </AnimatePresence>

              {/* Enhanced Input Area */}
              <div className="p-3 sm:p-6 border-t border-gray-100 bg-white/80 backdrop-blur-sm rounded-b-xl sm:rounded-b-2xl">
                <form
                  onSubmit={handleSendMessage}
                  className="flex items-end space-x-2 sm:space-x-4"
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message here..."
                    className="flex-1 px-3 py-3 sm:px-5 sm:py-4 border border-gray-200 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200 resize-none text-gray-900 placeholder-gray-500 text-sm sm:text-base"
                    disabled={loading}
                  />
                  <button
                    type="submit"
                    disabled={!inputMessage.trim() || loading}
                    className="px-4 py-3 sm:px-6 sm:py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl sm:rounded-2xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 disabled:hover:scale-100 flex-shrink-0"
                  >
                    <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
