import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../models/UserModel";
import { AppDataSource } from "../config/data-source";
import { Request, Response , NextFunction } from "express";
import { ObjectId } from "mongodb";
dotenv.config();
const userRepository = AppDataSource.getMongoRepository(User); 
const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, process.env.JWT_SECRET as string, { expiresIn: "7d" });
};


const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fullName, email, password, role } = req.body;

    if (role === "admin") {
      res.status(400).json({ message: "Cannot register as an admin. Admin access requires authorization." });
      return;
    }

    if (role !== "client" && role !== "owner") {
      res.status(400).json({ message: "Invalid role. Allowed roles are 'client' or 'owner'." });
      return;
    }

    if (!fullName || !email || !password) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    const existingUser = await userRepository.findOne({ where: { email } });
    if (existingUser) {
      res.status(400).json({ message: "Email already in use" });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = userRepository.create({
      fullName,
      email,
      password: hashedPassword,
      isVerified: false,
      role: role || "client",
      createdAt: new Date(),
      updatedAt: new Date(),
      transactionIdsAsPayer: [], 
      transactionIdsAsReceiver: [], 
      propertyIds: [], 
      notificationIds: [], 
      maintenanceRequestIds: [], 
      leaseIds: [], 
      bookingIds: [], 
    });

    await userRepository.save(newUser);

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error in registerUser:", error);
    res.status(500).json({ message: "Internal server error", error: (error as Error).message });
  }
};
const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    const user = await userRepository.findOne({ where: { email } });
    if (!user) {
      res.status(400).json({ message: "Invalid email or password" });
      return;
    }

    if (!user.password) {
      res.status(400).json({ message: "Use Google login" });
      return;
    }

    console.log("User Object:", user);
    console.log("User _id:", user._id?.toString());

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Invalid email or password" });
      return;
    }

    if (!user._id) {
      res.status(500).json({ message: "User ID is undefined" });
      return;
    }

    const token = generateToken(user._id.toString()); // Now it's a string
    console.log(token)


    res.status(200).json({ message: "Login successful", token, user });
  } catch (error) {
    console.error("Error in loginUser:", error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
};

const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.body;
    if (!userId) {
      res.status(400).json({ message: "User ID is required" });
      return;
    }
    const ID = new ObjectId(userId);
    const user = await userRepository.findOne({ where: { _id: ID } });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const token = generateToken(user._id.toString());
    res.status(200).json({ token  , user: user });
  }
  catch (error) {
    console.error("Error in refreshToken:", error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
};

//
const logoutUser = (req: Request, res: Response) => {
  res.status(200).json({ message: "Logout successful" });
};

const googleLogin = async (req: Request, res: Response): Promise<void> => {
  const { token } = req.body;

  if (!token) {
    res.status(400).json({ message: 'Google token is required.' });
    return;
  }

  try {
    const tokenInfoResponse = await fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${token}`);
    if (!tokenInfoResponse.ok) {
      throw new Error('Failed to verify Google token.');
    }
    const tokenInfo = await tokenInfoResponse.json();

    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!userInfoResponse.ok) {
      throw new Error('Failed to fetch user profile data.');
    }
    const userInfo = await userInfoResponse.json();

    const { email, name } = userInfo;

    const user: User | null = await userRepository.findOne({ where: { email } });
    if (!user) {
      res.status(404).json({ message: 'User not found. Please register.' });
      return;
    }

    const jwtToken = generateToken(user._id.toString());

    res.json({ token: jwtToken, user });
  } catch (error) {
    console.error('Google login failed:', error);

    if (error instanceof Error) {
      res.status(500).json({ message: error.message || 'Google login failed.' });
    } else {
      res.status(500).json({ message: 'Google login failed.' });
    }
  }
};
const googleRegister = async (req: Request, res: Response): Promise<void> => {
  const { token, role } = req.body;

  if (!token || !role) {
    res.status(400).json({ message: 'Google token and role are required.' });
    return;
  }

  try {
    const tokenInfoResponse = await fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${token}`);
    if (!tokenInfoResponse.ok) {
      throw new Error('Failed to verify Google token.');
    }
    const tokenInfo = await tokenInfoResponse.json();

    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!userInfoResponse.ok) {
      throw new Error('Failed to fetch user profile data.');
    }
    const userInfo = await userInfoResponse.json();

    const { email, name, picture, sub } = userInfo;

    const existingUser: User | null = await userRepository.findOne({ where: { email } });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists. Please log in.' });
      return;
    }

    const newUser: User = userRepository.create({
      fullName: name, 
      email,
      avatar: picture,
      googleId: sub,
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
      transactionIdsAsPayer: [],
      transactionIdsAsReceiver: [],
      propertyIds: [],
      notificationIds: [],
      maintenanceRequestIds: [],
      leaseIds: [],
      bookingIds: [],
    });
    await userRepository.save(newUser);
    const jwtToken = generateToken(newUser._id.toString());
    res.status(201).json({ token: jwtToken, user: newUser });
  } catch (error) {
    console.error('Google registration failed:', error);

    if (error instanceof Error) {
      res.status(500).json({ message: error.message || 'Google registration failed.' });
    } else {
      res.status(500).json({ message: 'Google registration failed.' });
    }
  }
};


export {registerUser, loginUser, logoutUser ,googleLogin,googleRegister,refreshToken};
