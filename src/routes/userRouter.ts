import { Router } from "express";
import { getUsers, getUserById, updateUser } from "../controllers/userController";
import { uploadSingle } from "../middlewares/uploadMiddleware";

const userRouter = Router();

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: Operations related to users
 */

/**
 * @swagger
 * /users:
 *   get:
 *     tags: [Users]
 *     summary: Get all users
 *     description: Retrieve a list of all users.
 *     responses:
 *       200:
 *         description: A list of users
 */
userRouter.get("/", getUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Get a user by ID
 *     description: Retrieve a user by their unique ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The user's ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The requested user
 *       404:
 *         description: User not found
 */
userRouter.get("/:id", getUserById);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     tags: [Users]
 *     summary: Update user by ID
 *     description: Update the user's information by their unique ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The user's ID
 *         schema:
 *           type: string
 *       - in: formData
 *         name: file
 *         type: file
 *         description: Profile image to upload
 *     responses:
 *       200:
 *         description: The updated user
 *       400:
 *         description: Invalid ID or data
 *       404:
 *         description: User not found
 */
userRouter.put("/:id", uploadSingle, updateUser);

export default userRouter;
