//middlware to verifier if the property is available for booking or lease 
import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../config/data-source';
import { Property } from '../models/PropertyModel';
import { ObjectId } from 'mongodb';
import { Lease } from '../models/LeaseModel';

const checkAvailability = () => async (req: Request, res: Response, next: NextFunction) => {
    const propertyRepository = AppDataSource.getMongoRepository(Property);
    const { id } = req.body;
  
    const propertyId = new ObjectId(id);
    const property = await propertyRepository.findOne({ where: { _id: propertyId } });
    if (!property) {
        return res.status(404).json({ message: 'Property not found' });
      }
  property?.status === 'available' ? next() : res.status(400).json({ error: 'Property not available' });

  };
  
  
  
  export default checkAvailability;
  