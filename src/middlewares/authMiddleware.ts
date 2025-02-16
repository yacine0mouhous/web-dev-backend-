import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../models/UserModel";
import { AppDataSource } from "../config/data-source";
import { ObjectId } from "mongodb";

dotenv.config();

const userRepository = AppDataSource.getRepository(User);

const verifyAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

  try {
    const token = req.header("Authorization");

    if (!token) {
      res.status(401).json({ message: "Unauthorized: No token provided" });
      console.log("No token provided");
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };



    const user = await userRepository.findOne({
      where: { _id: new ObjectId(decoded.userId) as any }, // Ensure ObjectId conversion
    });



    if (!user) {
      res.status(401).json({ message: "Unauthorized: Invalid token" });
      return;
    }

    req.user = { userId: user._id.toString(), role: user.role, email: user.email };
    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

export { verifyAuth };
