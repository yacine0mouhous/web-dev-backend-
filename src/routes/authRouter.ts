import express from "express";
import {googleAuth, googleAuthCallback, loginUser, logoutUser, registerUser } from "../controllers/authController";

const authRouter = express.Router();

// Register & Login Routes
authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);

// Google Auth Routes
authRouter.get("/google", googleAuth);
authRouter.get("/google/callback", googleAuthCallback);

// Logout Route
authRouter.post("/logout", logoutUser);

export default authRouter;
