import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import jwt from 'jsonwebtoken';
import { Review } from "../models/ReviewModel";
import { ObjectId } from "mongodb";

const reviewRepository = AppDataSource.getMongoRepository(Review);


const createReview = async (req: Request, res: Response): Promise<void> => {
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
            res.status(401).json({ message: 'Unauthorized: Invalid ownerId' });
            return;
        }
        const { propertyId, rating, comment } = req.body;

        if (!propertyId || !clientId || !rating) {
             res.status(400).json({ message: 'Missing required fields' });return
        }

        if (rating < 1 || rating > 5) {
             res.status(400).json({ message: 'Rating must be between 1 and 5' });return
        }

        const review = new Review();
        review.propertyId = new ObjectId(propertyId);
        review.clientId = new ObjectId(clientId);
        review.rating = rating;
        review.comment = comment || null; 
        review.createdAt = new Date(); 

        const savedReview = await reviewRepository.save(review);

        res.status(201).json({ message: 'Review created successfully', review: savedReview });
    } catch (error) {
        console.error('Error creating review:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const updateReview = async (req:Request,res:Response)=>{


    
}

const getAllReviews = async (req:Request,res:Response)=>{


    
}

const getReviewById = async (req:Request,res:Response)=>{


    
}

const deleteReview = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
             res.status(400).json({ message: 'Invalid review ID' });return
        }

        const reviewId = new ObjectId(id);
        const deleteResult = await reviewRepository.deleteOne({where:{ _id: reviewId }});
         
        if (deleteResult.deletedCount === 0) {
             res.status(404).json({ message: 'Review not found' });return
        }

        res.status(200).json({ message: 'Review deleted successfully' });
    } catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};





export {getAllReviews,getReviewById,createReview,updateReview,deleteReview}