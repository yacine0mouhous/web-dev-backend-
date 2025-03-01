import { Router } from "express"
import { createTransaction, getAllTransactions, getTransactionById, updateTransaction,deleteTransaction } from "../controllers/transactionController";
import { verifyAuth } from "../middlewares/authMiddleware";

const transactionRouter = Router()




// Get all Transactions
transactionRouter.get("/" ,getAllTransactions);

// create a transaction
transactionRouter.post("/create",verifyAuth ,createTransaction);

// Get transaction by ID
transactionRouter.get("/:id", getTransactionById);

// Update transaction by ID
transactionRouter.put("/:id",verifyAuth ,updateTransaction);
//delete transaction by ID
transactionRouter.delete("/:id", deleteTransaction);






export default transactionRouter