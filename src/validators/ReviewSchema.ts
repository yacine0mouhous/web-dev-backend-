import { z } from "zod";
import { ObjectId } from "mongodb";

export const ReviewSchema = z.object({
  propertyId: z.string(),
  clientId: z.string(),
  rating: z.string().transform((val) => parseInt(val, 10)).refine((val) => val >= 1 && val <= 5, {
    message: "Rating must be between 1 and 5",
  }), // Transform string to number and validate range
  comment: z.string().min(5).max(500),
});

export type ReviewType = z.infer<typeof ReviewSchema>;
