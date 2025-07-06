import { makeAuthenticatedRequest } from "../utils/axios";
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

class ChatService {
  // Get welcome message for different chat types (public endpoint)
  async getWelcomeMessage(chatType) {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/chats/welcome/${chatType}`
      );
      return response.data;
    } catch (error) {
      console.error("Error getting welcome message:", error);
      throw error;
    }
  }

  // Create a new chat with first message
  async createChat(message, chatType, subCategory = null) {
    try {
      const response = await makeAuthenticatedRequest({
        method: "POST",
        url: "/chats",
        data: {
          message,
          chatType,
          subCategory,
        },
      });
      return response; // response is already the data
    } catch (error) {
      console.error("Error creating chat:", error);
      throw error;
    }
  }

  // Send message to existing chat
  async sendMessage(chatId, message) {
    try {
      const response = await makeAuthenticatedRequest({
        method: "POST",
        url: `/chats/${chatId}/messages`,
        data: { message },
      });
      return response; // response is already the data
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  }

  // Get user's chats
  async getUserChats(chatType = null, page = 1, limit = 20) {
    try {
      const params = new URLSearchParams({ page, limit });
      if (chatType) params.append("chatType", chatType);

      const response = await makeAuthenticatedRequest({
        method: "GET",
        url: `/chats?${params.toString()}`,
      });
      return response; // response is already the data
    } catch (error) {
      console.error("Error fetching chats:", error);
      throw error;
    }
  }

  // Get specific chat
  async getChat(chatId) {
    try {
      const response = await makeAuthenticatedRequest({
        method: "GET",
        url: `/chats/${chatId}`,
      });
      return response; // response is already the data
    } catch (error) {
      console.error("Error fetching chat:", error);
      throw error;
    }
  }

  // Delete chat
  async deleteChat(chatId) {
    try {
      const response = await makeAuthenticatedRequest({
        method: "DELETE",
        url: `/chats/${chatId}`,
      });
      return response; // response is already the data
    } catch (error) {
      console.error("Error deleting chat:", error);
      throw error;
    }
  }

  // Get comprehensive chat history with detailed stats
  async getChatHistory(filters = {}) {
    try {
      const params = new URLSearchParams();

      // Add all filter parameters
      Object.keys(filters).forEach((key) => {
        if (
          filters[key] !== null &&
          filters[key] !== undefined &&
          filters[key] !== ""
        ) {
          params.append(key, filters[key]);
        }
      });

      const response = await makeAuthenticatedRequest({
        method: "GET",
        url: `/chats/history/detailed?${params.toString()}`,
      });
      return response;
    } catch (error) {
      console.error("Error fetching chat history:", error);
      throw error;
    }
  }

  // Get chat statistics
  async getChatStatistics(period = 30) {
    try {
      const response = await makeAuthenticatedRequest({
        method: "GET",
        url: `/chats/analytics/statistics?period=${period}`,
      });
      return response;
    } catch (error) {
      console.error("Error fetching chat statistics:", error);
      throw error;
    }
  }

  // Toggle bookmark status
  async toggleBookmark(chatId) {
    try {
      const response = await makeAuthenticatedRequest({
        method: "PATCH",
        url: `/chats/${chatId}/bookmark`,
      });
      return response;
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      throw error;
    }
  }

  // Export chat
  async exportChat(chatId, format = "json") {
    try {
      const response = await makeAuthenticatedRequest({
        method: "GET",
        url: `/chats/${chatId}/export?format=${format}`,
        responseType: format === "text" ? "blob" : "json",
      });
      return response;
    } catch (error) {
      console.error("Error exporting chat:", error);
      throw error;
    }
  }
}

export default new ChatService();
