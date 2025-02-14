import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Types } from "mongoose"; 
import { Transaction } from "../models/TransactionModel"; 

const transactionRepository = AppDataSource.getRepository(Transaction);

export const createTransaction = async (req: Request, res: Response) => {
  try {
    const { userId, amount, currency } = req.body;

    if (!userId || !amount || !currency) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const transaction = transactionRepository.create({
      userId: new Types.ObjectId(userId), 
      amount,
      currency,
      status: "completed",
    });

    await transactionRepository.save(transaction);

    res.status(201).json({ message: "Transaction successful", transaction });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error });
  }
};