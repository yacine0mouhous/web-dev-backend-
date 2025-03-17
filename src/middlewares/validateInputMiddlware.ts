import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

// Generic validation middleware
export const validateInput = (schema: ZodSchema<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({ errors: result.error.format() });return
    }

    req.body = result.data; // Replace with validated data
    next();
  };
};
