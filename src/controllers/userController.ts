import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { User } from "../models/UserModel";

const userRepository = AppDataSource.getMongoRepository(User);

export const getUsers = async (req: Request, res: Response) => {
  const users = await userRepository.find();
  res.json(users);
};

export const getUserById = async (req: Request, res: Response) => {
  const user = await userRepository.findOne({ where: { _id: req.params.id } });
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
};
