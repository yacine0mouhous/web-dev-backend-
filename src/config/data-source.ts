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

dotenv.config();

export const AppDataSource = new DataSource({
    type: "mongodb",
    url: process.env.MONGO_URI,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    synchronize: true,
    logging: false,
    entities: [User,Transaction,Property ,Booking , Lease , Review , Notification , MaintenanceRequest ], // Add all entities here
});
AppDataSource.initialize()
    .then(() => {
        console.log("Connected to MongoDB!");
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
    });