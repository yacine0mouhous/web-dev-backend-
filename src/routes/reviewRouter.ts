import { Router } from "express";
import { createReview, deleteReview, getAllReviews, getReviewById, updateReview } from "../controllers/reviewController";
import { verifyAuth } from "../middlewares/authMiddleware";

const reviewRouter = Router();

/**
 * @swagger
 * tags:
 *   - name: Reviews
 *     description: Operations related to reviews
 */

/**
 * @swagger
 * /reviews:
 *   get:
 *     tags: [Reviews]
 *     summary: Get all reviews
 *     description: Retrieve a list of all reviews.
 *     responses:
 *       200:
 *         description: A list of all reviews
 */
reviewRouter.get("/", getAllReviews);

/**
 * @swagger
 * /reviews/create:
 *   post:
 *     tags: [Reviews]
 *     summary: Create a review
 *     description: Create a new review for a property.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               propertyId:
 *                 type: string
 *                 description: The ID of the property being reviewed
 *               userId:
 *                 type: string
 *                 description: The ID of the user creating the review
 *               rating:
 *                 type: number
 *                 description: Rating for the property (1 to 5)
 *               comment:
 *                 type: string
 *                 description: The review comment
 *             required:
 *               - propertyId
 *               - userId
 *               - rating
 *     responses:
 *       201:
 *         description: Review created successfully
 *       400:
 *         description: Invalid review data
 */
reviewRouter.post("/create", verifyAuth, createReview);

/**
 * @swagger
 * /reviews/{id}:
 *   get:
 *     tags: [Reviews]
 *     summary: Get a review by ID
 *     description: Retrieve a review by its unique ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the review
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The requested review
 *       404:
 *         description: Review not found
 */
reviewRouter.get("/:id", getReviewById);

/**
 * @swagger
 * /reviews/{id}:
 *   put:
 *     tags: [Reviews]
 *     summary: Update a review by ID
 *     description: Update an existing review.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the review to update
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *                 description: Updated rating (1 to 5)
 *               comment:
 *                 type: string
 *                 description: Updated review comment
 *             required:
 *               - rating
 *     responses:
 *       200:
 *         description: Review updated successfully
 *       400:
 *         description: Invalid review data
 *       404:
 *         description: Review not found
 */
reviewRouter.put("/:id", verifyAuth, updateReview);

/**
 * @swagger
 * /reviews/{id}:
 *   delete:
 *     tags: [Reviews]
 *     summary: Delete a review by ID
 *     description: Delete an existing review by its unique ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the review to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *       404:
 *         description: Review not found
 */
reviewRouter.delete("/:id", verifyAuth, deleteReview);

export default reviewRouter;
