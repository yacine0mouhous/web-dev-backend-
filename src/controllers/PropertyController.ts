import { Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { User } from '../models/UserModel';
import { Property } from '../models/PropertyModel';
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

const userRepository = AppDataSource.getRepository(User);
const PropertyRepository = AppDataSource.getRepository(Property);

// Create Property
export const createProperty = async (req: Request, res: Response) => {
  try {
    const token = req.header("Authorization");

    if (!token) {
      res.status(401).json({ message: "Unauthorized: No token provided" });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
    const user = await userRepository.findOne({ where: { _id: new ObjectId(decoded.userId) } });

    if (!user) {
      res.status(401).json({ message: "Unauthorized: User not found" });
      return;
    }

    const newProperty = PropertyRepository.create({
      title: req.body.title,
      description: req.body.description,
      location: req.body.location,
      price: req.body.price,
      status: req.body.status,
      ownerId: user._id,
    });

    const savedProperty = await PropertyRepository.save(newProperty);
    res.status(201).json({ message: "Property created successfully", property: savedProperty });
    return;
    
  } catch (error) {
    console.error("Error creating property:", error);
    res.status(500).json({ message: "Can't create property", error: error });
    return;
  }
};

// Get Property by ID
export const getPropertyById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const ProId = new ObjectId(id);

    const property = await PropertyRepository.findOne({ where: { _id: ProId } });

    if (!property) {
      res.status(404).json({ message: "Property not found" });
      return;
    }

    res.status(200).json(property);
    return;
    
  } catch (error) {
    res.status(500).json({ message: "Error occurred, cannot complete the operation", error: (error as Error).message });
    return;
  }
};

// Update Property
export const updateProperty = async (req: Request, res: Response) => {
  const { id } = req.params;
  const ProId = new ObjectId(id);

  try {
    const property = await PropertyRepository.findOne({ where: { _id: ProId } });

    if (!property) {
      res.status(404).json({ message: "Property not found" });
      return;
    }

    PropertyRepository.merge(property, req.body);
    const updatedProperty = await PropertyRepository.save(property);

    res.status(200).json(updatedProperty);
    return;
    
  } catch (error) {
    res.status(500).json({ message: "Error occurred, cannot complete the operation", error: error });
    return;
  }
};

// Delete Property
export const deleteProperty = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const ProId = new ObjectId(id);

    const property = await PropertyRepository.findOne({ where: { _id: ProId } });

    if (!property) {
      res.status(404).json({ message: "Property not found" });
      return;
    }

    await PropertyRepository.remove(property);

    res.status(200).json({ message: "Property deleted successfully" });
    return;
    
  } catch (error) {
    console.error("Error deleting property:", error);
    res.status(500).json({ message: "An error occurred while deleting the property", error: (error as Error).message });
    return;
  }
};
