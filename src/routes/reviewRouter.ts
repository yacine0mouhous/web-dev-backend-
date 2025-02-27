import { Router } from "express"
import { createReview, getAllReviews, getReviewById, updateReview } from "../controllers/reviewController";
import { verifyAuth } from "../middlewares/authMiddleware";

const reviewRouter = Router()



// Get all reviews
reviewRouter.get("/" ,getAllReviews);

// create a review
reviewRouter.post("/create",verifyAuth ,createReview);

// Get review by ID
reviewRouter.get("/:id", getReviewById);

// Update review by ID
reviewRouter.put("/:id",verifyAuth ,updateReview);







export default reviewRouter