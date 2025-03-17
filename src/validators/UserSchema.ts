import { z } from "zod";

export const UserSchema = z.strictObject({
  fullName: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["client", "admin", "owner"]),
});

export type UserType = z.infer<typeof UserSchema>;
