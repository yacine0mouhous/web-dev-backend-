import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import jwt from 'jsonwebtoken';
import { Property } from "../models/PropertyModel";
import { ObjectId } from "mongodb";
import { deleteUserProperty, updateUserProperties } from "../utils/userUtils";

const propertyRepository = AppDataSource.getMongoRepository(Property);

const createProperty = async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            name,
            description,
            location,
            images,
            status,
            type,
            category,
            sellPrice,
            rentPrice,
            leaseTerm,
            roomCount
        } = req.body;

        const token = req.headers.authorization;
        if (!token) {
            res.status(401).json({ message: 'Unauthorized: Missing token' });
            return;
        }

        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            res.status(500).json({ message: 'Internal server error: Missing JWT secret' });
            return;
        }
        const decoded = jwt.verify(token, jwtSecret) as unknown as { userId: string };
        const ownerId = decoded.userId;

        if (!ownerId || !ObjectId.isValid(ownerId)) {
            res.status(401).json({ message: 'Unauthorized: Invalid ownerId' });
            return;
        }

        if (!name || !location || !status || !type || !category) {
            res.status(400).json({ message: 'Missing required fields' });
            return;
        }

        const property = propertyRepository.create({
            name,
            description: description || null,
            location,
            ownerId: new ObjectId(ownerId),
            images: images || [],
            status,
            type,
            category,
            sellPrice: sellPrice || null,
            rentPrice: rentPrice || null,
            leaseTerm: leaseTerm || null,
            roomCount: roomCount || null,
            transactionIds: [],
            maintenanceRequestIds: [],
            leaseIds: [],
            bookingIds: [],
        });

        const savedProperty = await propertyRepository.save(property);
        await updateUserProperties(savedProperty.ownerId!, savedProperty.id);

        res.status(201).json({ message: 'Property created successfully', property: savedProperty });
    } catch (error) {
        console.error('Error creating property:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


// update function 
const updateProperty = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const token = req.headers.authorization; 

    console.log('id:', id);
    console.log('token:', token);
    try {
        if (!token) {
            res.status(401).json({ message: 'Unauthorized: Missing token' });
            return;
        }

        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            res.status(500).json({ message: 'Internal server error: Missing JWT secret' });
            return;
        }

        const decoded = jwt.verify(token, jwtSecret) as { userId: string };
        const ownerId = decoded.userId;

        console.log('Decoded ownerId:', ownerId);

        if (!ObjectId.isValid(id)) {
            res.status(400).json({ message: 'Invalid property ID' });
            return;
        }

        const property = await propertyRepository.findOneBy({ _id: new ObjectId(id) });
        if (!property) {
            res.status(404).json({ message: 'Property not found' });
            return;
        }

        if (property.ownerId.toString() !== ownerId) {
            res.status(403).json({ message: 'Forbidden: You do not own this property' });
            return;
        }

        Object.assign(property, req.body);
        const updatedProperty = await propertyRepository.save(property);

        res.status(200).json({ message: 'Property updated successfully', property: updatedProperty });
    } catch (error) {
        console.error('Error updating property:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
    
};




// delete function 
const deleteProperty = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        if (!ObjectId.isValid(id)) {
            res.status(400).json({ message: 'Invalid property ID' });
            return;
        }

        const property = await propertyRepository.findOneBy({ _id: new ObjectId(id) });
        if (!property) {
            res.status(404).json({ message: 'Property not found' });
            return;
        }

        await propertyRepository.delete(new ObjectId(id));
        if (property.ownerId) {
            console.log(property.ownerId , property.id)
            await deleteUserProperty(property.ownerId, property.id);

        }


        res.status(200).json({ message: 'Property deleted successfully' });
    } catch (error) {
        console.error('Error deleting property:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};




// function to get all properties 
const getAllProperties = async (_req: Request, res: Response): Promise<void> => {
    try {
        const properties = await propertyRepository.find();
        res.status(200).json({ message: 'Properties retrieved successfully', properties });
    } catch (error) {
        console.error('Error retrieving properties:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};



//function to get propertie by id 
const getPropertyById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        if (!ObjectId.isValid(id)) {
            res.status(400).json({ message: 'Invalid property ID' });
            return;
        }

        const property = await propertyRepository.findOneBy({ _id: new ObjectId(id) });
        if (!property) {
            res.status(404).json({ message: 'Property not found' });
            return;
        }

        res.status(200).json({ message: 'Property retrieved successfully', property });
    } catch (error) {
        console.error('Error retrieving property:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
export {createProperty,getAllProperties,getPropertyById,updateProperty,deleteProperty}