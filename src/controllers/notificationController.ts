import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Notification } from "../models/NotificationModel";
import { ObjectId } from "mongodb";
import { deleteUserNotification, updateUserNotifications } from "../utils/userUtils";

const notificationRepository = AppDataSource.getMongoRepository(Notification);


const createNotification = async (req: Request, res: Response):Promise<void> => {
    try {
        const { userId, title, description, type } = req.body;

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

const getNotificationById = async (req:Request,res:Response)=>{


    
}
const getAllNotifications = async (req:Request,res:Response)=>{


    
}

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
        const deleteResult = await notificationRepository.deleteOne({where:{ _id: notificationId }});

        if (deleteResult.deletedCount === 0) {
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


const updateNotification = async (req:Request,res:Response)=>{


    
}

export {getNotificationById,deleteNotification,createNotification,updateNotification,getAllNotifications}