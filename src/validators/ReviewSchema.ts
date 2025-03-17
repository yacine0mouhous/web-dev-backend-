import { z } from "zod";
import { ObjectId } from "mongodb";

export const ReviewSchema = z.object({
  propertyId: z.instanceof(ObjectId),
  clientId: z.instanceof(ObjectId),
  rating: z.number().min(1).max(5),
  comment: z.string().min(5).max(500),
});

export type ReviewType = z.infer<typeof ReviewSchema>;
