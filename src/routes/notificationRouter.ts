import { Router } from "express";
import { createNotification, getAllNotifications, getNotificationById, updateNotification, deleteNotification } from "../controllers/notificationController";
import { verifyAuth } from "../middlewares/authMiddleware";

const notificationRouter = Router();

/**
 * @swagger
 * tags:
 *   - name: Notifications
 *     description: Operations related to notifications
 */

/**
 * @swagger
 * /notifications:
 *   get:
 *     tags: [Notifications]
 *     summary: Get all notifications
 *     description: Retrieve a list of all notifications.
 *     responses:
 *       200:
 *         description: A list of all notifications
 */
notificationRouter.get("/", getAllNotifications);

/**
 * @swagger
 * /notifications/create:
 *   post:
 *     tags: [Notifications]
 *     summary: Create a new notification
 *     description: Create a new notification after authenticating.
 *     security:
 *       - bearerAuth: []  # Add security schema for authentication
 *     responses:
 *       201:
 *         description: Notification created successfully
 *       400:
 *         description: Invalid notification data
 *       401:
 *         description: Unauthorized (invalid or missing token)
 */
notificationRouter.post("/create", verifyAuth, createNotification);

/**
 * @swagger
 * /notifications/{id}:
 *   get:
 *     tags: [Notifications]
 *     summary: Get a notification by ID
 *     description: Retrieve a notification by its unique ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the notification
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The requested notification
 *       404:
 *         description: Notification not found
 */
notificationRouter.get("/:id", getNotificationById);

/**
 * @swagger
 * /notifications/{id}:
 *   put:
 *     tags: [Notifications]
 *     summary: Update a notification by ID
 *     description: Update an existing notification by its unique ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the notification to update
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []  # Add security schema for authentication
 *     responses:
 *       200:
 *         description: The updated notification
 *       400:
 *         description: Invalid notification data
 *       404:
 *         description: Notification not found
 */
notificationRouter.put("/:id", verifyAuth, updateNotification);

/**
 * @swagger
 * /notifications/{id}:
 *   delete:
 *     tags: [Notifications]
 *     summary: Delete a notification by ID
 *     description: Delete a notification by its unique ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the notification to delete
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []  # Add security schema for authentication
 *     responses:
 *       200:
 *         description: Notification deleted successfully
 *       404:
 *         description: Notification not found
 */
notificationRouter.delete("/:id", verifyAuth, deleteNotification);

export default notificationRouter;
