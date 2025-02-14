import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../models/UserModel";
import { AppDataSource } from "../config/data-source";

dotenv.config();

const userRepository = AppDataSource.getRepository(User);


const verifyAuth = async (req: Request, res: Response, next: NextFunction):Promise<void> => {
  try {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
       res.status(401).json({ message: "Unauthorized: No token provided" });return
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };

    const user = await userRepository.findOne({ where: { id: decoded.userId } });

    if (!user) {
       res.status(401).json({ message: "Unauthorized: Invalid token" });return
    }

    req.user = {userId:user.id,role:user.role,email:user.email};
    next();
  } catch (error) {
     res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

export { verifyAuth };
