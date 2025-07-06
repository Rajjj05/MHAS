import React, { createContext, useContext, useState, useCallback } from "react";
import ChatService from "../services/ChatService";

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const [currentChat, setCurrentChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [chatStatistics, setChatStatistics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [welcomeMessage, setWelcomeMessage] = useState(null);

  // Get welcome message for chat type
  const getWelcomeMessage = useCallback(async (chatType) => {
    try {
      setLoading(true);
      setError(null);
      const response = await ChatService.getWelcomeMessage(chatType);
      console.log("Welcome message response:", response); // Debug log

      if (response && response.welcomeMessage) {
        setWelcomeMessage(response.welcomeMessage);
        return response.welcomeMessage;
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      setError(err.message || "Failed to get welcome message");
      console.error("Error getting welcome message:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new chat
  const createChat = useCallback(
    async (message, chatType, subCategory = null) => {
      try {
        setLoading(true);
        setError(null);

        // Create optimistic user message
        const userMessage = {
          role: "user",
          content: message,
          timestamp: new Date(),
          _id: `temp-user-${Date.now()}`,
        };

        // Create temporary chat with optimistic message
        const tempChat = {
          _id: `temp-chat-${Date.now()}`,
          messages: [userMessage],
          chatType,
          subCategory,
          title: "New Chat",
        };

        // Set optimistic chat immediately
        setCurrentChat(tempChat);

        const response = await ChatService.createChat(
          message,
          chatType,
          subCategory
        );

        console.log("Create chat response:", response); // Debug log

        if (response && response.success) {
          // Update the chat but preserve the message structure to avoid jumping
          setCurrentChat((prevChat) => ({
            ...response.chat,
            messages: response.chat.messages, // Use the complete messages from backend
          }));
          // Add to chats list if we have one
          setChats((prevChats) => [response.chat, ...prevChats]);
          return response.chat;
        } else {
          throw new Error(response?.message || "Invalid response format");
        }
      } catch (err) {
        // Clear optimistic chat on error
        setCurrentChat(null);
        setError(err.message || "Failed to create chat");
        console.error("Error creating chat:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Send message to current chat
  const sendMessage = useCallback(
    async (message) => {
      if (!currentChat) {
        throw new Error("No active chat");
      }

      try {
        setLoading(true);
        setError(null);

        // Optimistically add user message to current chat
        const userMessage = {
          role: "user",
          content: message,
          timestamp: new Date(),
          _id: `temp-${Date.now()}`, // Temporary ID for optimistic update
        };

        setCurrentChat((prevChat) => ({
          ...prevChat,
          messages: [...prevChat.messages, userMessage],
        }));

        const response = await ChatService.sendMessage(
          currentChat._id,
          message
        );

        console.log("Send message response:", response); // Debug log

        if (response && response.success) {
          // Just add AI response, keep the optimistic user message to avoid jumping
          setCurrentChat((prevChat) => ({
            ...prevChat,
            messages: [
              ...prevChat.messages, // Keep all existing messages including optimistic user message
              response.aiResponse, // Add AI response
            ],
          }));
          return response.aiResponse;
        } else {
          throw new Error(response?.message || "Invalid response format");
        }
      } catch (err) {
        // Remove optimistic user message on error
        setCurrentChat((prevChat) => ({
          ...prevChat,
          messages: prevChat.messages.slice(0, -1),
        }));
        setError(err.message || "Failed to send message");
        console.error("Error sending message:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [currentChat]
  );

  // Get user chats
  const getUserChats = useCallback(
    async (chatType = null, page = 1, limit = 20) => {
      try {
        setLoading(true);
        setError(null);
        const response = await ChatService.getUserChats(chatType, page, limit);

        if (response.success) {
          setChats(response.chats);
          return response;
        }
      } catch (err) {
        setError(err.message || "Failed to fetch chats");
        console.error("Error fetching chats:", err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Load specific chat
  const loadChat = useCallback(async (chatId, expectedChatType = null) => {
    try {
      setLoading(true);
      setError(null);
      const response = await ChatService.getChat(chatId);

      if (response.success) {
        // Validate chat type if expected type is provided
        if (expectedChatType && response.chat.chatType !== expectedChatType) {
          console.warn(
            `Chat type mismatch: expected ${expectedChatType}, got ${response.chat.chatType}`
          );
          // Don't load chat if it doesn't match expected type
          return null;
        }

        setCurrentChat(response.chat);
        return response.chat;
      }
    } catch (err) {
      setError(err.message || "Failed to load chat");
      console.error("Error loading chat:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete chat
  const deleteChat = useCallback(
    async (chatId) => {
      try {
        setLoading(true);
        setError(null);
        const response = await ChatService.deleteChat(chatId);

        if (response.success) {
          // Remove from chats list
          setChats((prevChats) =>
            prevChats.filter((chat) => chat._id !== chatId)
          );

          // Clear current chat if it's the deleted one
          if (currentChat && currentChat._id === chatId) {
            setCurrentChat(null);
          }
          return true;
        }
      } catch (err) {
        setError(err.message || "Failed to delete chat");
        console.error("Error deleting chat:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [currentChat]
  );

  // Clear current chat
  const clearCurrentChat = useCallback(() => {
    setCurrentChat(null);
    setWelcomeMessage(null);
  }, []);

  // Clear current chat if it doesn't match expected type
  const clearChatIfTypeMismatch = useCallback(
    (expectedChatType) => {
      if (
        currentChat &&
        currentChat.chatType &&
        currentChat.chatType !== expectedChatType
      ) {
        console.log(
          `Clearing chat due to type mismatch: current=${currentChat.chatType}, expected=${expectedChatType}`
        );
        clearCurrentChat();
      }
    },
    [currentChat, clearCurrentChat]
  );

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Get comprehensive chat history
  const getChatHistory = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await ChatService.getChatHistory(filters);

      if (response.success) {
        setChatHistory(response.chats);
        return response;
      }
      throw new Error(response?.message || "Failed to fetch chat history");
    } catch (err) {
      setError(err.message || "Failed to fetch chat history");
      console.error("Error fetching chat history:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get chat statistics
  const getChatStatistics = useCallback(async (period = 30) => {
    try {
      setLoading(true);
      setError(null);
      const response = await ChatService.getChatStatistics(period);

      if (response.success) {
        setChatStatistics(response);
        return response;
      }
      throw new Error(response?.message || "Failed to fetch statistics");
    } catch (err) {
      setError(err.message || "Failed to fetch statistics");
      console.error("Error fetching statistics:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Toggle bookmark
  const toggleBookmark = useCallback(
    async (chatId) => {
      try {
        const response = await ChatService.toggleBookmark(chatId);

        if (response.success) {
          // Update the chat in history if it exists
          setChatHistory((prevHistory) =>
            prevHistory.map((chat) =>
              chat._id === chatId
                ? { ...chat, isBookmarked: response.isBookmarked }
                : chat
            )
          );

          // Update current chat if it's the same
          if (currentChat && currentChat._id === chatId) {
            setCurrentChat((prevChat) => ({
              ...prevChat,
              isBookmarked: response.isBookmarked,
            }));
          }

          return response;
        }
        throw new Error(response?.message || "Failed to toggle bookmark");
      } catch (err) {
        setError(err.message || "Failed to toggle bookmark");
        console.error("Error toggling bookmark:", err);
        throw err;
      }
    },
    [currentChat]
  );

  // Continue existing chat from history
  const continueChat = useCallback(async (chatId) => {
    try {
      return await loadChat(chatId);
    } catch (err) {
      setError(err.message || "Failed to continue chat");
      console.error("Error continuing chat:", err);
      throw err;
    }
  }, []);

  // Export chat
  const exportChat = useCallback(async (chatId, format = "json") => {
    try {
      const response = await ChatService.exportChat(chatId, format);

      if (format === "text") {
        // Handle blob download for text format
        const url = window.URL.createObjectURL(response);
        const a = document.createElement("a");
        a.href = url;
        a.download = `chat-${chatId}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        return true;
      }

      return response;
    } catch (err) {
      setError(err.message || "Failed to export chat");
      console.error("Error exporting chat:", err);
      throw err;
    }
  }, []);

  const value = {
    // State
    currentChat,
    chats,
    chatHistory,
    chatStatistics,
    loading,
    error,
    welcomeMessage,

    // Actions
    getWelcomeMessage,
    createChat,
    sendMessage,
    getUserChats,
    loadChat,
    deleteChat,
    clearCurrentChat,
    clearChatIfTypeMismatch,
    clearError,

    // History actions
    getChatHistory,
    getChatStatistics,
    toggleBookmark,
    continueChat,
    exportChat,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
