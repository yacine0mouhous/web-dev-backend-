import passport, { Profile } from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy, VerifyCallback } from "passport-google-oauth20";
import { Repository } from "typeorm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import { User } from "../models/UserModel";
import { AppDataSource } from "../config/data-source";
import { Request, Response , NextFunction } from "express";
dotenv.config();

const userRepository = AppDataSource.getMongoRepository(User); // ✅ Use getMongoRepository() for MongoDB


const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, process.env.JWT_SECRET as string, { expiresIn: "7d" });
};


passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password", session: false },
    async (email: string, password: string, done) => {
      try {
        const user = await userRepository.findOne({ where: { email } });

        if (!user) return done(null, false, { message: "User not found" });

        if (!user.password) return done(null, false, { message: "Use Google login" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return done(null, false, { message: "Invalid credentials" });

        const token = generateToken(user._id!.toString());

        return done(null, { user, token });
      } catch (error) {
        return done(error, undefined);
      }
    }
  )
);


passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: "http://localhost:5000/auth/google/callback",
    },
    async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
      try {
        const email = profile.emails?.[0]?.value;

        if (!email) return done(new Error("Google account must have an email"), undefined);

        let user = await userRepository.findOne({ where: { email } });

        if (!user) {
          user = userRepository.create({
            fullName: profile.displayName,
            email,
            googleId: profile.id,
            isVerified: true,
            avatar: profile.photos?.[0]?.value || "",
            role: "client",
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
          await userRepository.save(user);
        }

        const token = generateToken(user._id.toString());

        return done(null, { user, token });
      } catch (error) {
        return done(error, undefined);
      }
    }
  )
);

passport.serializeUser((user: Express.User, done) => {
  done(null, user);
});

passport.deserializeUser((user: Express.User, done) => {
  done(null, user);
});

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

const googleAuth = passport.authenticate("google", { scope: ["profile", "email"] });

const googleAuthCallback = (req: Request, res: Response, next: NextFunction) => {
  console.log("Google Auth Callback");
  passport.authenticate("google", { session: false }, (err, data) => {
    if (err || !data) {
      return res.status(401).json({ message: "Google authentication failed" });
    }
    return res.status(200).json({ message: "Google login successful", token: data.token, user: data.user });
  })(req, res, next);
};
//
const logoutUser = (req: Request, res: Response) => {
  res.status(200).json({ message: "Logout successful" });
};



export { passport, registerUser, loginUser, googleAuth, googleAuthCallback, logoutUser };
