import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { MaintenanceRequest } from "../models/MaintenanceRequestModel";
import { ObjectId } from "mongodb";
import { deleteUserMaintenanceRequest, updateUserMaintenanceRequests } from "../utils/userUtils";
import { deletePropertyMaintenanceRequest, updatePropertyMaintenanceRequests } from "../utils/propertyUtils";

const MaintenanceRequestRepository = AppDataSource.getMongoRepository(MaintenanceRequest);



const createMaintenanceRequest = async (req: Request, res: Response):Promise<void> => {
    try {
        const { propertyId, clientId, ownerId, description } = req.body;

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

const updateMaintenanceRequest = async (req:Request,res:Response)=>{


    
}

const getAllMaintenanceRequests = async (req:Request,res:Response)=>{


    
}

const getMaintenanceRequestById = async (req:Request,res:Response)=>{


    
}

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
        const deleteResult = await MaintenanceRequestRepository.deleteOne({where:{ _id: maintenanceRequestId }});

        if (deleteResult.deletedCount === 0) {
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

export {deleteMaintenanceRequest,updateMaintenanceRequest,getAllMaintenanceRequests,getMaintenanceRequestById,createMaintenanceRequest}