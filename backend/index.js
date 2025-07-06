const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser"); // Add this
const connectDB = require("./utils/mongodb");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const passport = require("./config/passport");
const chatRoutes = require("./routes/chatRoutes"); // Import passport configuration

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser()); // Add this for cookie parsing

app.use(
  cors({
    origin: "http://localhost:5173", // Adjust this to your frontend URL
    credentials: true, // Allow cookies to be sent with requests
  })
);

// Initialize Passport middleware
app.use(passport.initialize());

app.use("/api/users", userRoutes);
app.use("/api/chats", chatRoutes); // Use chat routes
const PORT = process.env.PORT || 3000;

// Connect to MongoDB and then start the server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
