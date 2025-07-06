const Chat = require("../models/Chat");
const openaiService = require("../services/openaiService");
const mongoose = require("mongoose");

// Get welcome message for different chat types
const getWelcomeMessage = async (req, res) => {
  try {
    const { chatType } = req.params; // mental-health, spiritual, or general

    const welcomeMessage = openaiService.getWelcomeMessage(chatType);

    res.json({
      success: true,
      welcomeMessage,
      chatType,
    });
  } catch (error) {
    console.error("Error getting welcome message:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get welcome message",
    });
  }
};

// Create a new chat with first message
const createChat = async (req, res) => {
  try {
    const { message, chatType, subCategory } = req.body;
    const userId = req.user.userId;

    if (!message || !chatType) {
      return res.status(400).json({
        success: false,
        message: "Message and chat type are required",
      });
    }

    // Create initial messages array with user message
    const messages = [
      {
        role: "user",
        content: message,
        timestamp: new Date(),
      },
    ];

    // Prepare messages for Groq API (only role and content)
    const groqMessages = messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    // Get AI response based on chat type
    const aiResponse = await openaiService.getChatResponse(
      groqMessages,
      chatType
    );

    // Add AI response to messages
    messages.push({
      role: "assistant",
      content: aiResponse,
      timestamp: new Date(),
    });

    // Generate a title based on the conversation
    const title = await openaiService.generateChatTitle(groqMessages);

    // Create new chat in database
    const newChat = new Chat({
      userId,
      messages,
      chatType,
      subCategory,
      title,
    });

    await newChat.save();

    res.status(201).json({
      success: true,
      chat: newChat,
      message: "Chat created successfully",
    });
  } catch (error) {
    console.error("Error creating chat:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create chat",
      error: error.message,
    });
  }
};

// Send message to existing chat
const sendMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { message } = req.body;
    const userId = req.user.userId;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    // Find the chat
    const chat = await Chat.findOne({ _id: chatId, userId });
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    // Add user message
    const userMessage = {
      role: "user",
      content: message,
      timestamp: new Date(),
    };
    chat.messages.push(userMessage);

    // Prepare messages for OpenAI (keep context but limit to last 10 messages)
    const recentMessages = chat.messages.slice(-10).map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    // Get AI response with the appropriate context for this chat type
    const aiResponse = await openaiService.getChatResponse(
      recentMessages,
      chat.chatType
    );

    // Add AI response
    const aiMessage = {
      role: "assistant",
      content: aiResponse,
      timestamp: new Date(),
    };
    chat.messages.push(aiMessage);

    await chat.save();

    res.json({
      success: true,
      message: "Message sent successfully",
      userMessage: {
        ...userMessage,
        _id: chat.messages[chat.messages.length - 2]._id, // Get the ID from the saved message
      },
      aiResponse: {
        ...aiMessage,
        _id: chat.messages[chat.messages.length - 1]._id, // Get the ID from the saved message
      },
    });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send message",
      error: error.message,
    });
  }
};

// Get user's chats
const getUserChats = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { chatType, limit = 20, page = 1 } = req.query;

    const filter = { userId };
    if (chatType) {
      filter.chatType = chatType;
    }

    const chats = await Chat.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select("title chatType subCategory createdAt");

    const total = await Chat.countDocuments(filter);

    res.json({
      success: true,
      chats,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalChats: total,
      },
    });
  } catch (error) {
    console.error("Error fetching chats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch chats",
    });
  }
};

// Get specific chat
const getChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.userId;

    const chat = await Chat.findOne({ _id: chatId, userId });
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    res.json({
      success: true,
      chat,
    });
  } catch (error) {
    console.error("Error fetching chat:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch chat",
    });
  }
};

// Get comprehensive chat history with detailed stats
const getChatHistory = async (req, res) => {
  try {
    const userId = req.user.userId;
    const {
      chatType,
      limit = 20,
      page = 1,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
      dateFrom,
      dateTo,
    } = req.query;

    // Build filter object
    const filter = { userId };

    if (chatType && chatType !== "all") {
      filter.chatType = chatType;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { "messages.content": { $regex: search, $options: "i" } },
      ];
    }

    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
      if (dateTo) filter.createdAt.$lte = new Date(dateTo);
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Get chats with enhanced information
    const chats = await Chat.find(filter)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select(
        "title chatType subCategory createdAt updatedAt isBookmarked messages"
      )
      .lean();

    // Enhance each chat with statistics
    const enhancedChats = chats.map((chat) => ({
      _id: chat._id,
      title: chat.title,
      chatType: chat.chatType,
      subCategory: chat.subCategory,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
      isBookmarked: chat.isBookmarked,
      messageCount: chat.messages.length,
      lastMessage: chat.messages[chat.messages.length - 1],
      firstMessage: chat.messages[0],
      userMessageCount: chat.messages.filter((msg) => msg.role === "user")
        .length,
      aiMessageCount: chat.messages.filter((msg) => msg.role === "assistant")
        .length,
      conversationDuration:
        chat.messages.length > 1
          ? new Date(chat.messages[chat.messages.length - 1].timestamp) -
            new Date(chat.messages[0].timestamp)
          : 0,
    }));

    const total = await Chat.countDocuments(filter);

    // Get overall statistics
    const stats = await Chat.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          totalChats: { $sum: 1 },
          totalMessages: { $sum: { $size: "$messages" } },
          mentalHealthChats: {
            $sum: { $cond: [{ $eq: ["$chatType", "mental-health"] }, 1, 0] },
          },
          spiritualChats: {
            $sum: { $cond: [{ $eq: ["$chatType", "spiritual"] }, 1, 0] },
          },
          generalChats: {
            $sum: { $cond: [{ $eq: ["$chatType", "general"] }, 1, 0] },
          },
          bookmarkedChats: { $sum: { $cond: ["$isBookmarked", 1, 0] } },
          avgMessagesPerChat: { $avg: { $size: "$messages" } },
        },
      },
    ]);

    res.json({
      success: true,
      chats: enhancedChats,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalChats: total,
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
      statistics: stats[0] || {
        totalChats: 0,
        totalMessages: 0,
        mentalHealthChats: 0,
        spiritualChats: 0,
        generalChats: 0,
        bookmarkedChats: 0,
        avgMessagesPerChat: 0,
      },
      filters: {
        chatType,
        search,
        sortBy,
        sortOrder,
        dateFrom,
        dateTo,
      },
    });
  } catch (error) {
    console.error("Error fetching chat history:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch chat history",
      error: error.message,
    });
  }
};

// Get chat statistics dashboard
const getChatStatistics = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { period = "30" } = req.query; // days

    const periodDays = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - periodDays);

    // Get comprehensive statistics
    const stats = await Chat.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: null,
          totalChats: { $sum: 1 },
          totalMessages: { $sum: { $size: "$messages" } },
          mentalHealthChats: {
            $sum: { $cond: [{ $eq: ["$chatType", "mental-health"] }, 1, 0] },
          },
          spiritualChats: {
            $sum: { $cond: [{ $eq: ["$chatType", "spiritual"] }, 1, 0] },
          },
          generalChats: {
            $sum: { $cond: [{ $eq: ["$chatType", "general"] }, 1, 0] },
          },
          avgMessagesPerChat: { $avg: { $size: "$messages" } },
          longestConversation: { $max: { $size: "$messages" } },
          shortestConversation: { $min: { $size: "$messages" } },
        },
      },
    ]);

    // Get daily activity for the period
    const dailyActivity = await Chat.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          chatsCreated: { $sum: 1 },
          messagesExchanged: { $sum: { $size: "$messages" } },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Get most active chat types
    const chatTypeActivity = await Chat.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: "$chatType",
          count: { $sum: 1 },
          totalMessages: { $sum: { $size: "$messages" } },
          avgMessagesPerChat: { $avg: { $size: "$messages" } },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.json({
      success: true,
      period: `${periodDays} days`,
      statistics: stats[0] || {
        totalChats: 0,
        totalMessages: 0,
        mentalHealthChats: 0,
        spiritualChats: 0,
        generalChats: 0,
        avgMessagesPerChat: 0,
        longestConversation: 0,
        shortestConversation: 0,
      },
      dailyActivity,
      chatTypeActivity,
      insights: {
        mostActiveDay:
          dailyActivity.length > 0
            ? dailyActivity.reduce((max, day) =>
                day.chatsCreated > max.chatsCreated ? day : max
              )
            : null,
        preferredChatType:
          chatTypeActivity.length > 0 ? chatTypeActivity[0]._id : null,
        engagementLevel:
          stats[0]?.avgMessagesPerChat > 10
            ? "High"
            : stats[0]?.avgMessagesPerChat > 5
            ? "Medium"
            : "Low",
      },
    });
  } catch (error) {
    console.error("Error fetching chat statistics:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch chat statistics",
      error: error.message,
    });
  }
};

// Toggle bookmark status of a chat
const toggleBookmark = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.userId;

    const chat = await Chat.findOne({ _id: chatId, userId });
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    chat.isBookmarked = !chat.isBookmarked;
    await chat.save();

    res.json({
      success: true,
      message: `Chat ${
        chat.isBookmarked ? "bookmarked" : "unbookmarked"
      } successfully`,
      isBookmarked: chat.isBookmarked,
    });
  } catch (error) {
    console.error("Error toggling bookmark:", error);
    res.status(500).json({
      success: false,
      message: "Failed to toggle bookmark",
      error: error.message,
    });
  }
};

// Delete a specific chat
const deleteChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.userId;

    const chat = await Chat.findOneAndDelete({ _id: chatId, userId });
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    res.json({
      success: true,
      message: "Chat deleted successfully",
      deletedChat: {
        id: chat._id,
        title: chat.title,
        chatType: chat.chatType,
      },
    });
  } catch (error) {
    console.error("Error deleting chat:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete chat",
      error: error.message,
    });
  }
};

// Export chat conversation as JSON or text
const exportChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.userId;
    const { format = "json" } = req.query;

    const chat = await Chat.findOne({ _id: chatId, userId }).lean();
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    const exportData = {
      chatId: chat._id,
      title: chat.title,
      chatType: chat.chatType,
      subCategory: chat.subCategory,
      createdAt: chat.createdAt,
      messageCount: chat.messages.length,
      conversation: chat.messages.map((msg, index) => ({
        messageNumber: index + 1,
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp,
        timeFromStart: new Date(msg.timestamp) - new Date(chat.createdAt),
      })),
      exportedAt: new Date(),
      exportedBy: userId,
    };

    if (format === "text") {
      // Generate text format
      let textContent = `Chat: ${chat.title}\n`;
      textContent += `Type: ${chat.chatType}\n`;
      textContent += `Created: ${chat.createdAt}\n`;
      textContent += `Messages: ${chat.messages.length}\n\n`;
      textContent += "--- Conversation ---\n\n";

      chat.messages.forEach((msg, index) => {
        textContent += `[${index + 1}] ${msg.role.toUpperCase()}: ${
          msg.content
        }\n`;
        textContent += `Time: ${msg.timestamp}\n\n`;
      });

      res.setHeader("Content-Type", "text/plain");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="chat-${chat._id}.txt"`
      );
      return res.send(textContent);
    }

    // Default JSON format
    res.setHeader("Content-Type", "application/json");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="chat-${chat._id}.json"`
    );
    res.json(exportData);
  } catch (error) {
    console.error("Error exporting chat:", error);
    res.status(500).json({
      success: false,
      message: "Failed to export chat",
      error: error.message,
    });
  }
};

module.exports = {
  getWelcomeMessage,
  createChat,
  sendMessage,
  getUserChats,
  getChat,
  getChatHistory,
  getChatStatistics,
  toggleBookmark,
  deleteChat,
  exportChat,
};
