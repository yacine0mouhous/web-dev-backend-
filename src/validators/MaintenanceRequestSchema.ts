import { z } from "zod";
import { ObjectId } from "mongodb";

export const MaintenanceRequestSchema = z.object({
  propertyId: z.string().transform((val) => new ObjectId(val)), // Transform string to ObjectId
  clientId: z.string().transform((val) => new ObjectId(val)),  // Transform string to ObjectId
  ownerId: z.string().transform((val) => new ObjectId(val)),   // Transform string to ObjectId
  description: z.string().min(10).max(500),
  status: z.enum(["pending", "in-progress", "resolved"]),
});

export type MaintenanceRequestType = z.infer<typeof MaintenanceRequestSchema>;
