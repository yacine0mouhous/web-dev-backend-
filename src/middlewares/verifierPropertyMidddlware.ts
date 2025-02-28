import { Request, Response, NextFunction } from 'express';

const verifyPropertyType = (allowedTypes: string[]) => (req: Request, res: Response, next: NextFunction) => {
  const { propertyType } = req.body;

  if (!propertyType || !allowedTypes.includes(propertyType.toLowerCase())) {
    return res.status(400).json({ error: 'Invalid property type' });
  }

  next();
};

export default verifyPropertyType;
