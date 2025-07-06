const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const connectDB = require("../utils/mongodb");
const cors = require("cors");
const userRoutes = require("../routes/userRoutes");
const chatRoutes = require("../routes/chatRoutes");
const passport = require("../config/passport");
const serverless = require("serverless-http");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? ["https://your-frontend-domain.vercel.app"]
        : ["http://localhost:5173"],
    credentials: true,
  })
);

// Initialize Passport middleware
app.use(passport.initialize());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/chats", chatRoutes);

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ message: "Serenity AI Backend is running!" });
});

app.get("/api", (req, res) => {
  res.json({ message: "API is working!" });
});

// Connect to MongoDB
const startServer = async () => {
  try {
    await connectDB();
    console.log("MongoDB connected successfully for serverless function");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
  }
};

startServer();

// Export the serverless function
module.exports = serverless(app);
