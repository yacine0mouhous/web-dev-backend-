import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { User } from "../models/UserModel";
import { ObjectId } from "mongodb";
const userRepository = AppDataSource.getMongoRepository(User);
import bcrypt from "bcryptjs";
export const getUsers = async (req: Request, res: Response):Promise<void> => {
  const users = await userRepository.find();
  res.json(users);
};

export const getUserById = async (req: Request, res: Response):Promise<void> => {
  if (!ObjectId.isValid(req.params.id)) {
     res.status(400).json({ message: "Invalid user ID format" });return
  }
  const userId = new ObjectId(req.params.id);

  const user = await userRepository.findOne({ where: { _id: userId } });



  if (!user) {
     res.status(404).json({ message: "User not found" });return
  }

  res.json(user);
};



const mergeUser = async (
  user: User, 
  updates: Partial<{ 
    fullName: string; 
    email: string; 
    avatar: string;
    isVerified: boolean; 
    password: string; 
    currentPassword: string;
    role: "client" | "admin" | "owner";
  }>, 
  image?: Express.Multer.File
): Promise<void> => {
  // Update basic properties if provided
  if (updates.fullName !== undefined) user.fullName = updates.fullName;
  if (updates.email !== undefined) user.email = updates.email;
  if (updates.isVerified !== undefined) user.isVerified = updates.isVerified;
  if (updates.role !== undefined) user.role = updates.role;
  
  // Handle avatar updates
  if (updates.avatar === "delete") {
    user.avatar = undefined;
  } else if (image) {
    user.avatar = image.path;
  }

  // Handle password updates with validation
  if (updates.password) {
    if (updates.currentPassword) {
      // Verify current password if provided
      const isMatch = await bcrypt.compare(updates.currentPassword, user.password || '');
      if (!isMatch) {
        throw new Error('Invalid current password');
      }
    }
    // Hash and set new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(updates.password, salt);
    user.password = hashedPassword;
  }
  
  // Update the updatedAt timestamp
  user.updatedAt = new Date();
};

/**
 * Validates if a string is a valid MongoDB ObjectId
 */
const isValidObjectId = (id: string): boolean => {
  return ObjectId.isValid(id) && new ObjectId(id).toString() === id;
};

/**
 * Controller method to handle user updates
 */
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      fullName, 
      email, 
      avatar, 
      password, 
      currentPassword, 
      isVerified, 
      role 
    } = req.body;
    
    const image = req.file;
    const userIdString = req.params.id;
    
    if (!isValidObjectId(userIdString)) {
      res.status(400).json({ message: 'Invalid user ID format' });
      return;
    }
    const userId = new ObjectId(userIdString);
    const user = await userRepository.findOneBy({ _id: userId });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    const is_verified = isVerified == undefined ? undefined : isVerified === 'true';
    await mergeUser(
      user, 
      { 
        fullName, 
        email, 
        avatar, 
        password, 
        currentPassword, 
        isVerified:is_verified,
        role
      }, 
      image
    );
    console.log('User:', user.fullName, user.email, user.avatar, user.role , user.isVerified);
    await userRepository.update(user._id, user);

    const { password: _, ...userResponse } = user;
    
    res.json({ 
      message: 'User updated successfully',
      user: userResponse
    });
    
  } catch (error: any) {
    console.error('Error updating user:', error);
    
    if (error.message === 'Invalid current password') {
      res.status(400).json({ message: error.message });
    } else if (error.code === 11000) {
      res.status(400).json({ message: 'Email already in use' });
    } else {
      res.status(500).json({ 
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
};