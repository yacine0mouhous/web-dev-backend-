import { z } from "zod";
import { ObjectId } from "mongodb";

export const BookingSchema = z.object({
  propertyId: z.instanceof(ObjectId),
  clientId: z.instanceof(ObjectId),
  checkInDate: z.coerce.date(),
  checkOutDate: z.coerce.date(),
  status: z.enum(["pending", "confirmed", "canceled"]),
  totalAmount: z.number().positive(),
});

export type BookingType = z.infer<typeof BookingSchema>;
