import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Transaction } from "../models/TransactionModel";
import { ObjectId } from "mongodb";
import { deleteUserTransactionAsPayer, deleteUserTransactionAsReceiver, updateUserTransactionsAsPayer, updateUserTransactionsAsReceiver } from "../utils/userUtils";
import jwt from 'jsonwebtoken';
const transactionRepository = AppDataSource.getMongoRepository(Transaction);


const createTransaction = async (req: Request, res: Response): Promise<void> => {
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
        const decoded = jwt.verify(token, jwtSecret) as unknown as { userId: string; role: string };
        const { userId, role } = decoded;
        if (!userId || !ObjectId.isValid(userId)) {
            res.status(401).json({ message: 'Unauthorized: Invalid userid' });
            return;
        }
      const  payerId = decoded.userId;





        const { receiverId ,  propertyId, amount, currency, type, date, status, paymentMethod } = req.body;

        if (!payerId || !receiverId || !propertyId || !amount || !currency || !type || !date || !status || !paymentMethod) {
             res.status(400).json({ message: 'All fields are required' });return
        }

        const transaction = new Transaction();
        transaction.payerId = new ObjectId(payerId);
        transaction.receiverId = new ObjectId(receiverId);
        transaction.propertyId = new ObjectId(propertyId);
        transaction.amount = amount;
        transaction.currency = currency;
        transaction.type = type;
        transaction.date = new Date(date);
        transaction.status = status;
        transaction.paymentMethod = paymentMethod;

        await transactionRepository.save(transaction);
        await updateUserTransactionsAsPayer(transaction.payerId,transaction.id);
        await updateUserTransactionsAsReceiver(transaction.receiverId,transaction.id);

        res.status(201).json(transaction);
    } catch (error) {
        console.error('Error creating transaction:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getAllTransactions = async (req: Request, res: Response): Promise<void> => {
    try {
        const transactions = await transactionRepository.find();
        res.status(200).json(transactions);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getTransactionById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            res.status(400).json({ message: 'Invalid transaction ID' });
            return;
        }

        const transaction = await transactionRepository.findOne({ where: { _id: new ObjectId(id) } });

        if (!transaction) {
            res.status(404).json({ message: 'Transaction not found' });
            return;
        }

        res.status(200).json(transaction);
    } catch (error) {
        console.error('Error fetching transaction:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updateTransaction = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!ObjectId.isValid(id)) {
            res.status(400).json({ message: 'Invalid transaction ID' });
            return;
        }

        const transaction = await transactionRepository.findOne({ where: { _id: new ObjectId(id) } });

        if (!transaction) {
            res.status(404).json({ message: 'Transaction not found' });
            return;
        }

        if (status) transaction.status = status;

        await transactionRepository.save(transaction);
        res.status(200).json({ message: 'Transaction updated successfully', transaction });
    } catch (error) {
        console.error('Error updating transaction:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const deleteTransaction = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        if (!id || !ObjectId.isValid(id)) {
            res.status(400).json({ message: 'Invalid or missing transaction ID' });return 
        }

        const transactionId = new ObjectId(id);
        const transaction= await transactionRepository.findOne({where:{_id:transactionId}});


        if (!transaction) {
             res.status(404).json({ message: 'Transaction not found' });return
        }

       await transactionRepository.delete(transactionId);
        console.log(transaction.payerId , transaction.receiverId);
        await deleteUserTransactionAsPayer(new ObjectId(transaction!.payerId) , new ObjectId(transaction!.id));
        await deleteUserTransactionAsReceiver(new ObjectId(transaction!.receiverId),new ObjectId(transaction!.id));

        res.status(200).json({ message: 'Transaction deleted successfully' });
    } catch (error) {
        console.error('Error deleting transaction:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


export {getAllTransactions,getTransactionById,createTransaction,updateTransaction,deleteTransaction}