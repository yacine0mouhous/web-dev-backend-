import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Transaction } from "../models/TransactionModel";
import { ObjectId } from "mongodb";
import { updateUserTransactionsAsPayer, updateUserTransactionsAsReceiver } from "../utils/userUtils";

const transactionRepository = AppDataSource.getMongoRepository(Transaction);


const createTransaction = async (req: Request, res: Response): Promise<void> => {
    try {
        const { payerId, receiverId, propertyId, amount, currency, type, date, status, paymentMethod } = req.body;

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

const updateTransaction = async (req:Request,res:Response)=>{


    
}

const getAllTransactions = async (req:Request,res:Response)=>{


    
}

const getTransactionById = async (req:Request,res:Response)=>{


    
}

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

        await transactionRepository.deleteOne(transactionId);

        res.status(200).json({ message: 'Transaction deleted successfully' });
    } catch (error) {
        console.error('Error deleting transaction:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


export {getAllTransactions,getTransactionById,createTransaction,updateTransaction,deleteTransaction}