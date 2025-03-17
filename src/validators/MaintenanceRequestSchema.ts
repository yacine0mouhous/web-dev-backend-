import { z } from "zod";
import { ObjectId } from "mongodb";

export const MaintenanceRequestSchema = z.object({
  propertyId: z.instanceof(ObjectId),
  clientId: z.instanceof(ObjectId),
  ownerId: z.instanceof(ObjectId),
  description: z.string().min(10).max(500),
  status: z.enum(["pending", "in-progress", "resolved"]),
});

export type MaintenanceRequestType = z.infer<typeof MaintenanceRequestSchema>;
