import { Request, Response, NextFunction } from "express";

const verifyAdmin = (req: Request, res: Response, next: NextFunction) => {
  const { user }: any = req;

  if (!user) {
    return res.status(401).json({ message: "Unauthorized access" });
  }

  if (user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden: Admins only" });
  }

  next(); // ✅ Ensure next() is always called if no errors
};
export const verifyOwner = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === 'owner') {
    res.json({ message: "Owner access granted" });
  } else {
    res.status(403).json({ message: "Forbidden" });
  }
  next();
};
export { verifyAdmin, verifyOwner };
