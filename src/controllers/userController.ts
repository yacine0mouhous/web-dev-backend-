import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { User } from "../models/UserModel";
import { ObjectId } from "mongodb";

const userRepository = AppDataSource.getMongoRepository(User);

export const getUsers = async (req: Request, res: Response) => {
  const users = await userRepository.find();
  res.json(users);
};


//function to get users by id 
export const getUserById = async (req: Request, res: Response) => {
  console.log(req.params.id);

  // Ensure the id is a valid ObjectId
  if (!ObjectId.isValid(req.params.id)) {
     res.status(400).json({ message: "Invalid user ID format" });return
  }

  // Convert string ID to ObjectId
  const userId = new ObjectId(req.params.id);

  const user = await userRepository.findOne({ where: { _id: userId } });

  console.log(user);

  if (!user) {
     res.status(404).json({ message: "User not found" });return
  }

  res.json(user);
};



export const updateUser = async(req: Request, res: Response) => {
  const userId = new ObjectId(req.params.id);

  const user = await userRepository.findOne({ where: { _id: userId } });
  if (!user)  {res.status(404).json({ message: "User not found" }); return }
  userRepository.merge(user, req.body);
  await userRepository.save(user);
  res.json(user);
}
