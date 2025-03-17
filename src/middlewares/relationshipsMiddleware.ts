import { Request, Response, NextFunction } from "express";
import { ObjectId } from "mongodb";
import { AppDataSource } from "../config/data-source";
import { User } from "../models/UserModel";
import { Property } from "../models/PropertyModel";

const userRepository = AppDataSource.getMongoRepository(User);
const propertyRepository = AppDataSource.getMongoRepository(Property);

const isUserExists = async (req: Request, res: Response, next: NextFunction):Promise<void> => {
  const { userId } = req.body; 

  if (!userId) {
     res.status(400).json({ message: "User ID is required" });return
  }

  try {
    if (!ObjectId.isValid(userId)) {
       res.status(400).json({ message: "Invalid User ID" });return
    }

    const user = await userRepository.findOne({
      where: { _id: new ObjectId(userId) },
    });

    if (!user) {
       res.status(404).json({ message: "User not found" });return
    }

    next();
  } catch (error) {
    console.error("Error in isUserExists middleware:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const isPropertyExists = async (req: Request, res: Response, next: NextFunction):Promise<void> => {
  const { propertyId } = req.body; 
  if (!propertyId) {
     res.status(400).json({ message: "Property ID is required" });return
  }
  try {
    if (!ObjectId.isValid(propertyId)) {
       res.status(400).json({ message: "Invalid Property ID" });return
    }
    const property = await propertyRepository.findOne({
      where: { _id: new ObjectId(propertyId) },
    });
    if (!property) {
       res.status(404).json({ message: "Property not found" });return
    }
    next();
  } catch (error) {
    console.error("Error in isPropertyExists middleware:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};









export { isUserExists , isPropertyExists };



