import express from "express";
import { googleAuth, googleAuthCallback, loginUser, logoutUser, registerUser } from "../controllers/authController";

const router = express.Router();

// Register & Login Routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Google Auth Routes
router.get("/google", googleAuth);
router.get("/google/callback", googleAuthCallback);

// Logout Route
router.post("/logout", logoutUser);

export default router;
