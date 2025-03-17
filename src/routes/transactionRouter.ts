import { Router } from "express";
import { createTransaction, getAllTransactions, getTransactionById, updateTransaction, deleteTransaction, getAllTransactionsByUserId } from "../controllers/transactionController";
import { verifyAuth } from "../middlewares/authMiddleware";

const transactionRouter = Router();

/**
 * @swagger
 * tags:
 *   - name: Transactions
 *     description: Operations related to transactions
 */

/**
 * @swagger
 * /transactions:
 *   get:
 *     tags:
 *       - Transactions
 *     summary: Get all transactions
 *     description: Retrieve a list of all transactions.
 *     responses:
 *       200:
 *         description: A list of all transactions
 */
transactionRouter.get("/", verifyAuth, getAllTransactions);

/**
 * @swagger
 * /transactions/user/{userId}:
 *   get:
 *     tags:
 *       - Transactions
 *     summary: Get all transactions by user ID
 *     description: Retrieve a list of all transactions for a specific user by user ID.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The ID of the user whose transactions are being fetched
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of transactions for the specified user
 *       404:
 *         description: User not found
 */
transactionRouter.get("/user/:userId", verifyAuth, getAllTransactionsByUserId);

/**
 * @swagger
 * /transactions/create:
 *   post:
 *     tags:
 *       - Transactions
 *     summary: Create a new transaction
 *     description: Create a new transaction in the system.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 description: The amount of the transaction
 *               userId:
 *                 type: string
 *                 description: The user ID associated with the transaction
 *               propertyId:
 *                 type: string
 *                 description: The property ID associated with the transaction
 *             required:
 *               - amount
 *               - userId
 *               - propertyId
 *     responses:
 *       201:
 *         description: Transaction created successfully
 *       400:
 *         description: Invalid transaction data
 */
transactionRouter.post("/create", verifyAuth, createTransaction);

/**
 * @swagger
 * /transactions/{id}:
 *   get:
 *     tags:
 *       - Transactions
 *     summary: Get transaction by ID
 *     description: Retrieve a transaction by its unique ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the transaction
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The requested transaction
 *       404:
 *         description: Transaction not found
 */
transactionRouter.get("/:id", getTransactionById);

/**
 * @swagger
 * /transactions/{id}:
 *   put:
 *     tags:
 *       - Transactions
 *     summary: Update transaction by ID
 *     description: Update an existing transaction by its unique ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the transaction to update
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 description: The updated amount for the transaction
 *               userId:
 *                 type: string
 *                 description: The updated user ID for the transaction
 *               propertyId:
 *                 type: string
 *                 description: The updated property ID for the transaction
 *     responses:
 *       200:
 *         description: Transaction updated successfully
 *       400:
 *         description: Invalid transaction data
 *       404:
 *         description: Transaction not found
 */
transactionRouter.put("/:id", verifyAuth, updateTransaction);

/**
 * @swagger
 * /transactions/{id}:
 *   delete:
 *     tags:
 *       - Transactions
 *     summary: Delete a transaction by ID
 *     description: Delete an existing transaction by its unique ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the transaction to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Transaction deleted successfully
 *       404:
 *         description: Transaction not found
 */
transactionRouter.delete("/:id", deleteTransaction);

export default transactionRouter;
