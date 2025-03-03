import express from "express";
import { googleLogin, googleRegister, loginUser, logoutUser, registerUser } from "../controllers/authController";

const authRouter = express.Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);

authRouter.post("/google-login", googleLogin);
authRouter.post("/google-register", googleRegister);

authRouter.post("/logout", logoutUser);

export default authRouter;
