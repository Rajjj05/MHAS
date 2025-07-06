const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// Google OAuth success callback
const googleAuthSuccess = async (req, res) => {
  try {
    console.log("OAuth callback triggered");
    console.log("Request user:", req.user ? "User exists" : "No user");
    console.log("FRONTEND_URL:", process.env.FRONTEND_URL);

    if (!req.user) {
      console.log("No user found, redirecting to frontend");
      return res.redirect(process.env.FRONTEND_URL);
    }

    console.log("Generating token for user:", req.user._id);
    const token = generateToken(req.user._id);
    console.log("Token generated successfully");

    const redirectUrl = `${process.env.FRONTEND_URL}/?token=${token}&user=${encodeURIComponent(
      JSON.stringify({
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        avatar: req.user.avatar,
      })
    )}`;

    console.log("Redirecting to:", redirectUrl);
    res.redirect(redirectUrl);
  } catch (error) {
    console.error("Google auth error:", error);
    console.error("Error stack:", error.stack);
    res.redirect(`${process.env.FRONTEND_URL}/login?error=server_error`);
  }
};

// Alternative: Google OAuth success callback with secure cookies
const googleAuthSuccessSecure = async (req, res) => {
  try {
    if (!req.user) {
      return res.redirect(
        `${process.env.FRONTEND_URL}/login?error=auth_failed`
      );
    }

    const token = generateToken(req.user._id);

    // Set HTTP-only cookie for security
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use HTTPS in production
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Redirect to frontend homepage without token in URL
    res.redirect(`${process.env.FRONTEND_URL}/?auth=success`);
  } catch (error) {
    console.error("Google auth error:", error);
    res.redirect(`${process.env.FRONTEND_URL}/login?error=server_error`);
  }
};

// Google OAuth failure callback
const googleAuthFailure = (req, res) => {
  res.redirect(`${process.env.FRONTEND_URL}/login?error=google_auth_failed`);
};

// Get current user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-googleId");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Logout user
const logoutUser = (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    res.json({ success: true, message: "Logged out successfully" });
  });
};

const updateUserProfile = async (req, res) => {
  try {
    const { name } = req.body;

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) user.name = name;

    await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Simple test endpoint
const testEndpoint = (req, res) => {
  res.json({
    message: "UserController working",
    timestamp: new Date().toISOString(),
    env: {
      JWT_SECRET: process.env.JWT_SECRET ? "Set" : "Not set",
      FRONTEND_URL: process.env.FRONTEND_URL ? "Set" : "Not set",
      NODE_ENV: process.env.NODE_ENV,
    },
  });
};

module.exports = {
  googleAuthSuccess,
  googleAuthSuccessSecure,
  googleAuthFailure,
  getUserProfile,
  logoutUser,
  updateUserProfile,
  generateToken,
  testEndpoint,
};
