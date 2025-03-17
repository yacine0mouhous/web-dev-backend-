import { Router } from "express"
import { createTransaction, getAllTransactions, getTransactionById, updateTransaction,deleteTransaction, getAllTransactionsByUserId } from "../controllers/transactionController";
import { verifyAuth } from "../middlewares/authMiddleware";

const transactionRouter = Router()




// Get all Transactions
transactionRouter.get("/",verifyAuth ,getAllTransactions);
transactionRouter.get("/user/:userId" ,verifyAuth,getAllTransactionsByUserId);

// create a transaction
transactionRouter.post("/create",verifyAuth ,createTransaction);

// Get transaction by ID
transactionRouter.get("/:id", getTransactionById);

// Update transaction by ID
transactionRouter.put("/:id",verifyAuth ,updateTransaction);
//delete transaction by ID
transactionRouter.delete("/:id", deleteTransaction);






export default transactionRouter