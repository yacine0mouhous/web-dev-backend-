import { Router } from "express";
import { getUsers, getUserById, updateUser } from "../controllers/userController";

const router = Router();

// Get all users
router.get("/users", getUsers);

// Get user by ID
router.get("/users/:id", getUserById);

// Update user by ID
router.put("/users/:id", updateUser);

export default router;
