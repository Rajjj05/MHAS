const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    messages: [
      {
        role: {
          type: String,
          enum: ["user", "assistant"],
          required: true,
        },
        content: {
          type: String,
          required: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    chatType: {
      type: String,
      enum: ["mental-health", "spiritual", "general"],
      required: true,
    },

    subCategory: {
      type: String,
    },

    title: {
      type: String,
      required: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },

    updatedAt: {
      type: Date,
      default: Date.now,
    },

    isBookmarked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // This automatically manages createdAt and updatedAt
  }
);

const Chat = mongoose.model("Chat", chatSchema);
module.exports = Chat;
