import express from "express";
import { googleLogin, googleRegister, loginUser, logoutUser, refreshToken, registerUser } from "../controllers/authController";
import { verifyAuth } from "../middlewares/authMiddleware";

const authRouter = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: User authentication and authorization operations
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags: [Authentication]
 *     summary: Register a new user
 *     description: Register a new user with email and password.
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid data
 */
authRouter.post("/register", registerUser);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Authentication]
 *     summary: Log in an existing user
 *     description: Log in with email and password.
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       400:
 *         description: Invalid credentials
 */
authRouter.post("/login", loginUser);

/**
 * @swagger
 * /auth/google-login:
 *   post:
 *     tags: [Authentication]
 *     summary: Google login
 *     description: Log in using Google authentication.
 *     responses:
 *       200:
 *         description: User logged in via Google
 *       400:
 *         description: Invalid token or error
 */
authRouter.post("/google-login", googleLogin);

/**
 * @swagger
 * /auth/google-register:
 *   post:
 *     tags: [Authentication]
 *     summary: Google registration
 *     description: Register using Google authentication.
 *     responses:
 *       201:
 *         description: User registered via Google
 *       400:
 *         description: Invalid token or error
 */
authRouter.post("/google-register", googleRegister);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     tags: [Authentication]
 *     summary: Log out the current user
 *     description: Log out the current authenticated user.
 *     responses:
 *       200:
 *         description: User logged out successfully
 */
authRouter.post("/logout", logoutUser);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     tags: [Authentication]
 *     summary: Refresh authentication token
 *     description: Refresh the authentication token using a refresh token.
 *     security:
 *       - bearerAuth: []  # Add security schema for authentication
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *       401:
 *         description: Invalid or expired refresh token
 */
authRouter.post("/refresh", verifyAuth, refreshToken);

export default authRouter;
