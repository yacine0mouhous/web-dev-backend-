import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import jwt from 'jsonwebtoken';
import { Property } from "../models/PropertyModel";
import { ObjectId } from "mongodb";
import { deleteUserProperty, updateUserProperties } from "../utils/userUtils";
import dotenv from "dotenv";
const propertyRepository = AppDataSource.getMongoRepository(Property);
dotenv.config();

const createProperty = async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            name,
            description,
            country,
            state,
            city,
            status,
            type,
            category,
            sellPrice,
            rentPrice,
            leaseTerm,
            roomCount,
        } = req.body;
 
        const images = req.files as Express.Multer.File[];
        const ownerId = req.body.ownerId;
        console.log(ObjectId.isValid(ownerId));
        
        if (!ownerId || !ObjectId.isValid(ownerId)) {
            res.status(401).json({ message: 'Unauthorized: Invalid ownerId' });
            return;
        }

        if (!name || !country || !state || !city || !status || !type || !category) {
            res.status(400).json({ message: 'Missing required fields' });
            return;
        }

        const imagePaths = images.map((file) => file.path);

        const property = propertyRepository.create({
            name,
            description: description || null,
            country,
            state,
            city,
            ownerId: new ObjectId(ownerId),
            images: imagePaths,
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
        console.log(savedProperty);
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

const getAllProperties = async (req: Request, res: Response): Promise<void> => {
    try {
        // Query the database for all properties
        const properties = await propertyRepository.find();

        // Return the properties as the response
        res.status(200).json({ message: 'Properties retrieved successfully', properties });
    } catch (error) {
        console.error('Error retrieving properties:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getPropertyById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        
        // 1. Check if the provided ID is valid
        if (!ObjectId.isValid(id)) {
            res.status(400).json({ message: 'Invalid property ID' });
            return;
        }

        // 2. Query the database to fetch the property by ID
        const property = await propertyRepository.findOneBy({ _id: new ObjectId(id) });

        if (!property) {
            res.status(404).json({ message: 'Property not found' });
            return;
        }

        // 3. Return the property as the response
        res.status(200).json({ message: 'Property retrieved successfully', property });
    } catch (error) {
        console.error('Error retrieving property:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const SearchController = async (req: Request, res: Response): Promise<void> => {
    try {
        const {  country, state, city, status, type, category } = req.query;

        // Create search conditions based on the query parameters
        const searchConditions: any = {};

    
        if (country) searchConditions.country = { $regex: new RegExp(country as string, "i") };
        if (state) searchConditions.state = { $regex: new RegExp(state as string, "i") };
        if (city) searchConditions.city = { $regex: new RegExp(city as string, "i") };
        if (status) searchConditions.status = status;
        if (type) searchConditions.type = type;
        if (category) searchConditions.category = { $regex: new RegExp(category as string, "i") };

        // Perform the search using the conditions
        const properties = await propertyRepository.find({
            where: searchConditions
        });

        if (properties.length === 0) {
            res.status(404).json({ message: 'No properties found matching the search criteria' });
            return;
        }

        res.status(200).json({
            message: 'Properties retrieved successfully',
            properties,
        });
    } catch (error) {
        console.error('Error searching properties:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
export {createProperty,getAllProperties,getPropertyById,updateProperty,deleteProperty,SearchController};
