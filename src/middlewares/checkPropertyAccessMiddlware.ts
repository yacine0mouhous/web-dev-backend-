

import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../config/data-source";
import jwt from "jsonwebtoken";
import { User } from "../models/UserModel";
import { ObjectId } from "mongodb";
import { Property } from "../models/PropertyModel";
import { Booking } from "../models/BookingModel";
// verifier if the client is booked to the property 
export const verifierAccess = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;;
      if (!token) return res.status(403).json({ message: 'Token missing' });
  
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
      const userId = decoded.id;
  
      const bookingId = req.params.bookingId;
      if (!bookingId) return res.status(400).json({ message: 'Property ID missing' });
  
      const bookingRepo = AppDataSource.getRepository(Booking);
      const booking = await bookingRepo.findOne({ where: { id: new ObjectId(bookingId) } });
  
      if (!booking) return res.status(404).json({ message: 'Property not found' });
  
      if ( booking.clientId!== userId) {
        return res.status(403).json({ message: 'Access denied' });
      }
  
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token or unauthorized' });
    }
  };