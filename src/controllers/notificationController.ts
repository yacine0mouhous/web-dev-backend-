import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Notification } from "../models/NotificationModel";
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";
import { deleteUserNotification, updateUserNotifications } from "../utils/userUtils";

const notificationRepository = AppDataSource.getMongoRepository(Notification);


const createNotification = async (req: Request, res: Response):Promise<void> => {


    try {
  const token = req.headers.authorization;
        if (!token) {
            res.status(401).json({ message: 'Unauthorized: Missing token' });
            return;
        }

        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            res.status(500).json({ message: 'Internal server error: Missing JWT secret' });
            return;
        }
        const decoded = jwt.verify(token, jwtSecret) as unknown as { userId: string };
        const userId= decoded.userId;

        if (!userId || !ObjectId.isValid(userId)) {
            res.status(401).json({ message: 'Unauthorized: Invalid ownerId' });
            return;
        }








        const { title, description, type } = req.body;

        if (!userId || !title || !description || !type) {
             res.status(400).json({ message: 'Missing required fields' });return
        }

        const notification = new Notification();
        notification.userId = new ObjectId(userId);
        notification.title = title;
        notification.description = description;
        notification.type = type;
        notification.status = 'unread';
        notification.createdAt = new Date(); 

        const savedNotification = await notificationRepository.save(notification);
        await updateUserNotifications(savedNotification.userId!,savedNotification.id);
        res.status(201).json({ message: 'Notification created successfully', notification: savedNotification });
    } catch (error) {
        console.error('Error creating notification:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getNotificationById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            res.status(400).json({ message: 'Invalid notification ID' });
            return;
        }

        const notification = await notificationRepository.findOne({ where: { _id: new ObjectId(id) } });

        if (!notification) {
            res.status(404).json({ message: 'Notification not found' });
            return;
        }

        res.status(200).json({ notification });
    } catch (error) {
        console.error('Error fetching notification:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getAllNotifications = async (req: Request, res: Response): Promise<void> => {
    try {
        const notifications = await notificationRepository.find();
        res.status(200).json({ notifications });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


const deleteNotification = async (req: Request, res: Response): Promise<void> => {
    try {

        const { id } = req.params;

        console.log('Received DELETE request for notification ID:', id);

        if (!ObjectId.isValid(id)) {
            console.log('Invalid notification ID:', id);
            res.status(400).json({ message: 'Invalid notification ID' });
            return;
        }

        const notificationId = new ObjectId(id);

        console.log('Looking for notification with ID:', notificationId);
        const notification = await notificationRepository.findOne({ where: { _id: notificationId } });

        if (!notification) {
            console.log('Notification not found:', notificationId);
            res.status(404).json({ message: 'Notification not found' });
            return;
        }

        console.log('Deleting notification:', notification);
        const deleteResult = await notificationRepository.delete( notificationId);

        if (!deleteResult) {
            console.log('Failed to delete notification:', notificationId);
            res.status(404).json({ message: 'Notification not found' });
            return;
        }

        console.log('Removing notification ID from user:', notification.userId);
        await deleteUserNotification(notification.userId, notificationId);

        res.status(200).json({ message: 'Notification deleted successfully' });
    } catch (error) {
        console.error('Error deleting notification:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updateNotification = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!ObjectId.isValid(id)) {
            res.status(400).json({ message: 'Invalid notification ID' });
            return;
        }

        if (!status) {
            res.status(400).json({ message: 'Missing status field' });
            return;
        }

        const notification = await notificationRepository.findOne({ where: { _id: new ObjectId(id) } });

        if (!notification) {
            res.status(404).json({ message: 'Notification not found' });
            return;
        }

        notification.status = status;
        await notificationRepository.save(notification);

        res.status(200).json({ message: 'Notification updated successfully', notification });
    } catch (error) {
        console.error('Error updating notification:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
export {getNotificationById,deleteNotification,createNotification,updateNotification,getAllNotifications}