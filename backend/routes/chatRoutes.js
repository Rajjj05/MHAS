const express = require("express");
const authenticateJWT = require("../middlewares/auth");
const {
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
} = require("../controllers/ChatController");

const router = express.Router();

// Public route for welcome messages (or make it authenticated if needed)
router.get("/welcome/:chatType", getWelcomeMessage);

// All other routes require authentication
router.use(authenticateJWT);

// Core chat functionality
router.post("/", createChat);
router.get("/", getUserChats);
router.get("/:chatId", getChat);
router.post("/:chatId/messages", sendMessage);

// History and analytics endpoints
router.get("/history/detailed", getChatHistory);
router.get("/analytics/statistics", getChatStatistics);

// Chat management endpoints
router.patch("/:chatId/bookmark", toggleBookmark);
router.delete("/:chatId", deleteChat);
router.get("/:chatId/export", exportChat);

module.exports = router;
