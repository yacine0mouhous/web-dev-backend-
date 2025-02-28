import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Lease } from "../models/LeaseModel";
import { ObjectId } from "mongodb";
import { deleteUserLease, updateUserLeases } from "../utils/userUtils";
import { deletePropertyLease, updatePropertyLeases } from "../utils/propertyUtils";

const LeaseRepository = AppDataSource.getMongoRepository(Lease);


const createLease = async (req: Request, res: Response):Promise<void> => {
    try {
        const { propertyId, clientId, startDate, endDate, rentAmount } = req.body;

        if (!propertyId || !clientId || !startDate || !endDate || !rentAmount) {
             res.status(400).json({ message: 'Missing required fields' });return
        }

        const lease = new Lease();
        lease.propertyId = new ObjectId(propertyId);
        lease.clientId = new ObjectId(clientId);
        lease.startDate = new Date(startDate);
        lease.endDate = new Date(endDate);
        lease.rentAmount = rentAmount;
        lease.status = 'pending';

        const savedLease = await LeaseRepository.save(lease);
        await updateUserLeases(savedLease.clientId,savedLease.id);
        await updatePropertyLeases(savedLease.propertyId,savedLease.id);

        res.status(201).json({ message: 'Lease created successfully', lease: savedLease });
    } catch (error) {
        console.error('Error creating lease:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updateLease = async (req:Request,res:Response)=>{


    
}

const getAllLeases = async (req:Request,res:Response)=>{


    
}

const getLeaseById = async (req:Request,res:Response)=>{


    
}

const deleteLease = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        console.log('Received DELETE request for lease ID:', id);

        if (!ObjectId.isValid(id)) {
            console.log('Invalid lease ID:', id);
            res.status(400).json({ message: 'Invalid lease ID' });
            return;
        }

        const leaseId = new ObjectId(id);

        console.log('Looking for lease with ID:', leaseId);
        const lease = await LeaseRepository.findOneBy({ _id: leaseId });

        if (!lease) {
            console.log('Lease not found:', leaseId);
            res.status(404).json({ message: 'Lease not found' });
            return;
        }

        console.log('Deleting lease:', lease);
        const deleteResult = await LeaseRepository.deleteOne({where:{ _id: leaseId }});

        if (deleteResult.deletedCount === 0) {
            console.log('Failed to delete lease:', leaseId);
            res.status(404).json({ message: 'Lease not found' });
            return;
        }

        console.log('Removing lease ID from client:', lease.clientId);
        await deleteUserLease(lease.clientId, leaseId);

        console.log('Removing lease ID from property:', lease.propertyId);
        await deletePropertyLease(lease.propertyId, leaseId);

        res.status(200).json({ message: 'Lease deleted successfully' });
    } catch (error) {
        console.error('Error deleting lease:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export {getAllLeases,getLeaseById,deleteLease,createLease,updateLease}