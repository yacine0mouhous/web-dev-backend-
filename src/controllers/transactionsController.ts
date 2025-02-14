import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Types } from "mongoose"; 
import { Transaction } from "../models/TransactionModel"; 

const transactionRepository = AppDataSource.getRepository(Transaction);

export const createTransaction = async (req: Request, res: Response) => {
  try {
    const { receiverId, amount, currency } = req.body;
    const userId = (req as any).user?.userId;

    if (!receiverId || !amount || !currency || !userId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const transaction = transactionRepository.create({
      userId: new Types.ObjectId(userId), 
      amount:-amount,
      currency,
      status: "completed",
    });

    const receivedTransaction = transactionRepository.create({
      userId: new Types.ObjectId(receiverId), 
      amount,
      currency,
      status: "completed",
    });

    await transactionRepository.save(transaction);
    await transactionRepository.save(receivedTransaction);

    res.status(201).json({ message: "Transaction successful", transaction });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error });
  }
};