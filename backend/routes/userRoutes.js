const express = require("express");
const passport = require("passport");
const authenticateJWT = require("../middlewares/auth");
const {
  googleAuthSuccess,
  googleAuthSuccessSecure,
  googleAuthFailure,
  getUserProfile,
  logoutUser,
  updateUserProfile,
} = require("../controllers/UserController");

const router = express.Router();

// Google OAuth routes
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/api/users/auth/failure",
    session: false, // Disable session for stateless JWT authentication
  }),
  googleAuthSuccess
);

router.get("/auth/failure", googleAuthFailure);

// Protected routes (require JWT)
router.get("/profile", authenticateJWT, getUserProfile);
router.post("/logout", authenticateJWT, logoutUser);
router.put("/profile", authenticateJWT, updateUserProfile);

module.exports = router;
