import { Router } from "express";
import { getUsers, getUserById, updateUser } from "../controllers/userController";
import { uploadSingle } from "../middlewares/uploadMiddleware";

const userRouter = Router();

// Get all users
userRouter.get("/", getUsers);

// Get user by ID
userRouter.get("/:id", getUserById);

// Update user by ID
userRouter.put("/:id",uploadSingle ,updateUser);

export default userRouter;
