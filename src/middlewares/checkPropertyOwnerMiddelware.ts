import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../config/data-source";
import jwt from "jsonwebtoken";
import { User } from "../models/UserModel";
import { ObjectId } from "mongodb";
import { Property } from "../models/PropertyModel";
export const verifyOwner= async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;;
      if (!token) return res.status(403).json({ message: 'Token missing' });
  
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
      const userId = decoded.id;
  
      const propertyId = req.params.propertyId;
      if (!propertyId) return res.status(400).json({ message: 'Property ID missing' });
  
      const propertyRepo = AppDataSource.getRepository(Property);
      const property = await propertyRepo.findOne({ where: { id: new ObjectId(propertyId) } });
  
      if (!property) return res.status(404).json({ message: 'Property not found' });
  
      if (property.ownerId !== userId) {
        return res.status(403).json({ message: 'Access denied' });
      }
  
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token or unauthorized' });
    }
  };