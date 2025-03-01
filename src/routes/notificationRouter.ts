import { Router } from "express"
import { createNotification, getAllNotifications, getNotificationById, updateNotification,deleteNotification } from "../controllers/notificationController";
import { verifyAuth } from "../middlewares/authMiddleware";

const notificationRouter = Router()




// Get all notifications
notificationRouter.get("/" ,getAllNotifications);

// create a notification
notificationRouter.post("/create",verifyAuth ,createNotification);

// Get notification by ID
notificationRouter.get("/:id", getNotificationById);

// Update notification by ID
notificationRouter.put("/:id",verifyAuth ,updateNotification);
//delete notification by ID
notificationRouter.delete("/:id",verifyAuth ,deleteNotification);





export default notificationRouter