import express from "express";
import { googleLogin, googleRegister, loginUser, logoutUser, refreshToken, registerUser } from "../controllers/authController";
import { verifyAuth } from "../middlewares/authMiddleware";

const authRouter = express.Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);

authRouter.post("/google-login", googleLogin);
authRouter.post("/google-register", googleRegister);

authRouter.post("/logout", logoutUser);
authRouter.post("/refresh",verifyAuth ,refreshToken);
export default authRouter;
