import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { MaintenanceRequest } from "../models/MaintenanceRequestModel";
import { ObjectId } from "mongodb";
import jwt from 'jsonwebtoken';
import { deleteUserMaintenanceRequest, updateUserMaintenanceRequests } from "../utils/userUtils";
import { deletePropertyMaintenanceRequest, updatePropertyMaintenanceRequests } from "../utils/propertyUtils";

const MaintenanceRequestRepository = AppDataSource.getMongoRepository(MaintenanceRequest);



const createMaintenanceRequest = async (req: Request, res: Response):Promise<void> => {
    try {
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
        const clientId= decoded.userId;

        if (!clientId || !ObjectId.isValid(clientId)) {
            res.status(401).json({ message: 'Unauthorized: Invalid ownerId' });
            return;
        }

        const { propertyId, ownerId, description } = req.body;

        if (!propertyId || !clientId || !ownerId || !description) {
             res.status(400).json({ message: 'Missing required fields' });return
        }

        const maintenanceRequest = new MaintenanceRequest();
        maintenanceRequest.propertyId = new ObjectId(propertyId);
        maintenanceRequest.clientId = new ObjectId(clientId);
        maintenanceRequest.ownerId = new ObjectId(ownerId);
        maintenanceRequest.description = description;
        maintenanceRequest.status = 'pending';
        maintenanceRequest.reportedAt = new Date(); 

        const savedMaintenanceRequest = await MaintenanceRequestRepository.save(maintenanceRequest);
        await updateUserMaintenanceRequests(savedMaintenanceRequest.clientId!,savedMaintenanceRequest.id!);
        await updatePropertyMaintenanceRequests(savedMaintenanceRequest.propertyId!,savedMaintenanceRequest.id!);
        res.status(201).json({ message: 'Maintenance request created successfully', maintenanceRequest: savedMaintenanceRequest });
    } catch (error) {
        console.error('Error creating maintenance request:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updateMaintenanceRequest = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { status, description } = req.body;

        if (!ObjectId.isValid(id)) {
            res.status(400).json({ message: 'Invalid maintenance request ID' });
            return;
        }

        const maintenanceRequestId = new ObjectId(id);

        const maintenanceRequest = await MaintenanceRequestRepository.findOne({ where: { _id: maintenanceRequestId } });

        if (!maintenanceRequest) {
            res.status(404).json({ message: 'Maintenance request not found' });
            return;
        }

        if (status) maintenanceRequest.status = status;
        if (description) maintenanceRequest.description = description;

        await MaintenanceRequestRepository.save(maintenanceRequest);

        res.status(200).json({ message: 'Maintenance request updated successfully', maintenanceRequest });
    } catch (error) {
        console.error('Error updating maintenance request:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getAllMaintenanceRequests = async (req: Request, res: Response): Promise<void> => {
    try {
        const maintenanceRequests = await MaintenanceRequestRepository.find();
        res.status(200).json(maintenanceRequests);
    } catch (error) {
        console.error('Error fetching maintenance requests:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
const getAllMaintenanceRequestsByOwnerId = async (req: Request, res: Response): Promise<void> => {
    try {
        const maintenanceRequests = await MaintenanceRequestRepository.findBy({ where: { ownerId: new ObjectId(req.params.ownerId) } });
        res.status(200).json(maintenanceRequests);
    } catch (error) {
        console.error('Error fetching maintenance requests:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getMaintenanceRequestById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            res.status(400).json({ message: 'Invalid maintenance request ID' });
            return;
        }

        const maintenanceRequestId = new ObjectId(id);

        const maintenanceRequest = await MaintenanceRequestRepository.findOne({ where: { _id: maintenanceRequestId } });

        if (!maintenanceRequest) {
            res.status(404).json({ message: 'Maintenance request not found' });
            return;
        }

        res.status(200).json(maintenanceRequest);
    } catch (error) {
        console.error('Error fetching maintenance request:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
const deleteMaintenanceRequest = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        console.log('Received DELETE request for maintenance request ID:', id);

        if (!ObjectId.isValid(id)) {
            console.log('Invalid maintenance request ID:', id);
            res.status(400).json({ message: 'Invalid maintenance request ID' });
            return;
        }

        const maintenanceRequestId = new ObjectId(id);

        console.log('Looking for maintenance request with ID:', maintenanceRequestId);
        const maintenanceRequest = await MaintenanceRequestRepository.findOne({ where: { _id: maintenanceRequestId } });

        if (!maintenanceRequest) {
            console.log('Maintenance request not found:', maintenanceRequestId);
            res.status(404).json({ message: 'Maintenance request not found' });
            return;
        }

        console.log('Deleting maintenance request:', maintenanceRequest);
        const deleteResult = await MaintenanceRequestRepository.delete( maintenanceRequestId);

        if (!deleteResult) {
            console.log('Failed to delete maintenance request:', maintenanceRequestId);
            res.status(404).json({ message: 'Maintenance request not found' });
            return;
        }

        console.log('Removing maintenance request ID from client:', maintenanceRequest.clientId);
        await deleteUserMaintenanceRequest(maintenanceRequest.clientId!, maintenanceRequestId);

        console.log('Removing maintenance request ID from property:', maintenanceRequest.propertyId);
        await deletePropertyMaintenanceRequest(maintenanceRequest.propertyId!, maintenanceRequestId);

        res.status(200).json({ message: 'Maintenance request deleted successfully' });
    } catch (error) {
        console.error('Error deleting maintenance request:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export {deleteMaintenanceRequest,updateMaintenanceRequest,getAllMaintenanceRequests,getAllMaintenanceRequestsByOwnerId,getMaintenanceRequestById,createMaintenanceRequest}