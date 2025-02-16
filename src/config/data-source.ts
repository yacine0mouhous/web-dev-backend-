import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { User } from "../models/UserModel";
import { Transaction } from "../models/TransactionModel";
import { Property } from "../models/PropertyModel";

dotenv.config();

export const AppDataSource = new DataSource({
    type: "mongodb",
    url: process.env.MONGO_URI, // MongoDB connection string from .env
    useNewUrlParser: true,
    useUnifiedTopology: true,
    synchronize: true, // Auto sync schema (disable in production)
    logging: false,
    entities: [User,Transaction,Property], // Add all entities here
});
AppDataSource.initialize()
    .then(() => {
        console.log("Connected to MongoDB!");
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
    });