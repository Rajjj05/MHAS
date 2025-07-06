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
    const frontendUrl =
      process.env.FRONTEND_URL || console.log("Frontend URL:", frontendUrl); // Debug log
    console.log("Environment variables:", {
      FRONTEND_URL: process.env.FRONTEND_URL,
      CLIENT_URL: process.env.CLIENT_URL,
      NODE_ENV: process.env.NODE_ENV,
    });

    if (!req.user) {
      return res.redirect(frontendUrl);
    }

    const token = generateToken(req.user._id);

    // Redirect to frontend homepage with token as query parameter
    res.redirect(
      `${frontendUrl}/?token=${token}&user=${encodeURIComponent(
        JSON.stringify({
          id: req.user._id,
          name: req.user.name,
          email: req.user.email,
          avatar: req.user.avatar,
        })
      )}`
    );
  } catch (error) {
    console.error("Google auth error:", error);
    const frontendUrl =
      process.env.FRONTEND_URL ||
      process.env.CLIENT_URL ||
      "http://localhost:5173";
    res.redirect(`${frontendUrl}/login?error=server_error`);
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

module.exports = {
  googleAuthSuccess,
  googleAuthSuccessSecure,
  googleAuthFailure,
  getUserProfile,
  logoutUser,
  updateUserProfile,
  generateToken,
};
