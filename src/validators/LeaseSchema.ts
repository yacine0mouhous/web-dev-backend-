import { z } from "zod";
import { ObjectId } from "mongodb";

export const LeaseSchema = z.object({
  propertyId: z.instanceof(ObjectId),
  clientId: z.instanceof(ObjectId),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  status: z.enum(["active", "pending", "terminated"]),
  rentAmount: z.number().positive(),
});

export type LeaseType = z.infer<typeof LeaseSchema>;
