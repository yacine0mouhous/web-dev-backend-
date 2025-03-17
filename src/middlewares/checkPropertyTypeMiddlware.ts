import { Request, Response, NextFunction } from 'express';
import { Property } from '../models/PropertyModel';
import { AppDataSource } from '../config/data-source';
import { ObjectId } from 'mongodb';
import { Lease } from '../models/LeaseModel';

const verifyPropertyType = (allowedTypes: string[]) => async (req: Request, res: Response, next: NextFunction) => {
  const propertyRepository = AppDataSource.getMongoRepository(Property);
  const { id } = req.body;

  const propertyId = new ObjectId(id);
  const property = await propertyRepository.findOne({ where: { _id: propertyId } });

  if (!property) {
    return res.status(404).json({ message: 'Property not found' });
  }

  if (!property.type || !allowedTypes.includes(property.type.toLowerCase())) {
    return res.status(400).json({ error: 'Invalid property type' });
  }

  next();
};



export default verifyPropertyType;
