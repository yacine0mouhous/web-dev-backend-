import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { Conversation } from "../models/conversationModel";
import { AppDataSource } from "../config/data-source"; // Use your DataSource

export class MessageController {
  static async sendMessage(req: Request, res: Response) {
    const { senderId, receiverId, content } = req.body;
    const conversationRepo = AppDataSource.getMongoRepository(Conversation); // FIXED

    let conversation = await conversationRepo.findOne({
      where: { participants: { $all: [senderId, receiverId] } },
    });

    if (!conversation) {
      conversation = await conversationRepo.save({
        participants: [senderId, receiverId],
        messages: [],
      });
    }

    const newMessage = { senderId, content, createdAt: new Date() };

    conversation.messages.push(newMessage); // Append the new message to the array
    await conversationRepo.save(conversation); // Save the updated conversation
    
      
    res.json(newMessage);
    console.log(conversation)
    console.log("created into the db ");
  }

  static async getMessages(req: Request, res: Response) {
    const { conversationId } = req.params;
    const id = new ObjectId(conversationId);
    const conversationRepo = AppDataSource.getMongoRepository(Conversation); // FIXED
    
    const conversation = await conversationRepo.findOne({ where: { _id: id } });
    res.json(conversation ? conversation.messages : []);
  }
}
