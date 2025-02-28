import { Router } from "express";
import { getUsers, getUserById, updateUser } from "../controllers/userController";

const userRouter = Router();

// Get all users
userRouter.get("/", getUsers);

// Get user by ID
userRouter.get("/:id", getUserById);

// Update user by ID
userRouter.put("/:id", updateUser);

export default userRouter;
