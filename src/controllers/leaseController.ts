import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Lease } from "../models/LeaseModel";
import { ObjectId } from "mongodb";
import { deleteUserLease, updateUserLeases } from "../utils/userUtils";
import { deletePropertyLease, updatePropertyLeases } from "../utils/propertyUtils";
import jwt from 'jsonwebtoken';
import { User } from "../models/UserModel";
const LeaseRepository = AppDataSource.getMongoRepository(Lease);
const UserRepository = AppDataSource.getMongoRepository(User);

const createLease = async (req: Request, res: Response):Promise<void> => {
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
            res.status(401).json({ message: 'Unauthorized: Invalid clientId ' });
            return;
        }

        const { propertyId, startDate, endDate, rentAmount } = req.body;

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

const updateLease = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { startDate, endDate, rentAmount, status } = req.body;

        if (!ObjectId.isValid(id)) {
            res.status(400).json({ message: "Invalid lease ID" });
            return;
        }

        const leaseId = new ObjectId(id);
        const lease = await LeaseRepository.findOne({ where: { _id: leaseId } });

        if (!lease) {
            res.status(404).json({ message: "Lease not found" });
            return;
        }

        if (startDate) lease.startDate = new Date(startDate);
        if (endDate) lease.endDate = new Date(endDate);
        if (rentAmount) lease.rentAmount = rentAmount;
        if (status) lease.status = status;

        const updatedLease = await LeaseRepository.save(lease);
        res.status(200).json({ message: "Lease updated successfully", lease: updatedLease });
    } catch (error) {
        console.error("Error updating lease:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const getAllLeases = async (req: Request, res: Response): Promise<void> => {
    try {
        const leases = await LeaseRepository.find();
        res.status(200).json({ leases });
    } catch (error) {
        console.error("Error fetching leases:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
const getAllLeasesByOwnerId = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            res.status(400).json({ message: "Invalid owner ID" });
            return;
        }
        const ownerId = new ObjectId(id);
        const user = await UserRepository.findOneBy({ _id: ownerId });
        if (!user || !user.propertyIds || user.propertyIds.length === 0) {
             res.status(404).json({ message: "User not found or has no properties" });return
        }
        const leases = await LeaseRepository.find({
            where: { propertyId: { $in: user.propertyIds } }
        });
        res.status(200).json({ leases });
    } catch (error) {
        console.error("Error fetching leases:", error);
        res.status(500).json({ message: "Internal server error" });
    }

   
};

const getAllLeasesByClientId = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            res.status(400).json({ message: "Invalid owner ID" });
            return;
        }
        const ownerId = new ObjectId(id);
       
        const leases = await LeaseRepository.find({
            where: { clientId: ownerId }
        });
        res.status(200).json({ leases });
    } catch (error) {
        console.error("Error fetching leases:", error);
        res.status(500).json({ message: "Internal server error" });
    }

   
};

const getLeaseById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            res.status(400).json({ message: "Invalid lease ID" });
            return;
        }

        const leaseId = new ObjectId(id);
        const lease = await LeaseRepository.findOne({ where: { _id: leaseId } });

        if (!lease) {
            res.status(404).json({ message: "Lease not found" });
            return;
        }

        res.status(200).json({ lease });
    } catch (error) {
        console.error("Error fetching lease:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


const deleteLease = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            res.status(400).json({ message: 'Invalid lease ID' });
            return;
        }

        const leaseId = new ObjectId(id);
        const lease = await LeaseRepository.findOne({ where: { _id: leaseId } });

        if (!lease) {
            res.status(404).json({ message: 'Lease not found' });
            return;
        }

        const deleteResult = await LeaseRepository.deleteOne({ _id: leaseId });

        if (deleteResult.deletedCount === 0) {
            res.status(404).json({ message: 'Lease not found' });
            return;
        }
        
       console.log(lease)
 console.log(lease.propertyId)
 console.log(lease.clientId)

        // Remove lease ID from user
        await deleteUserLease(lease.clientId, leaseId);

        // Remove lease ID from property
        await deletePropertyLease(lease.propertyId, leaseId);

        res.status(200).json({ message: 'Lease deleted successfully' });
    } catch (error) {
        console.error('Error deleting lease:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export {getAllLeases,getLeaseById,deleteLease,createLease,updateLease,getAllLeasesByOwnerId,getAllLeasesByClientId}