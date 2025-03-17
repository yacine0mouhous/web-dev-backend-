import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../config/data-source";
import jwt from "jsonwebtoken";
import { User } from "../models/UserModel";
import { ObjectId } from "mongodb";

const userRepository = AppDataSource.getRepository(User);

const verifieRole = (roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const token = req.header("Authorization");

      if (!token) {
        res.status(401).json({ message: "Unauthorized: No token provided" });return 
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };

      const user = await userRepository.findOne({
        where: { _id: new ObjectId(decoded.userId) },
      });

      if (!user) {
     res.status(401).json({ message: "Unauthorized: User not found" });return
      }

      if (!roles.includes(user.role!)) {
      res.status(403).json({ message: "Forbidden: Insufficient permissions" });return 
      }
      req.user = { userId: user._id, role: user.role, email: user.email };
      next();
    } catch (error) {
      console.error("Authorization Error:", error);
      res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
  };
};

export default verifieRole;
