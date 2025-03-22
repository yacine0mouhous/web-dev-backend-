import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { User } from "../models/UserModel";
import { Transaction } from "../models/TransactionModel";
import { Property } from "../models/PropertyModel";
import { Booking } from "../models/BookingModel";
import { Lease } from "../models/LeaseModel";
import { Review } from "../models/ReviewModel";
import { Notification } from "../models/NotificationModel";
import { MaintenanceRequest } from "../models/MaintenanceRequestModel";
import { createClient } from "redis"; // Import redis client
import { Conversation } from "../models/conversationModel";

dotenv.config();

// MongoDB DataSource
export const AppDataSource = new DataSource({
    type: "mongodb",
    url: process.env.MONGO_URI,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    synchronize: true,
    logging: false,
    entities: [
        User, Transaction, Property, Booking, Lease, Review, Notification, MaintenanceRequest , Conversation
    ], // Add all entities here
});
/*
// Redis client initialization
export const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379', // Adjust the Redis URL if necessary
});

// Connect to Redis
const connectRedis = async () => {
    try {
        await redisClient.connect();
        console.log("Connected to Redis!");
    } catch (error) {
        console.error("Error connecting to Redis:", error);
    }
};
*/
// Initialize MongoDB connection and Redis connection
AppDataSource.initialize()
    .then(() => {
        console.log("Connected to MongoDB!");
      /*  connectRedis(); // Connect to Redis after MongoDB is connected*/
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
    });
