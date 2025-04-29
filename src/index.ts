import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import "reflect-metadata";
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import authRouter from "./routes/authRouter";
import userRouter from "./routes/userRouter";
import propertyRouter from "./routes/propertyRouter";
import maintenanceRouter from "./routes/maintenanceRouter";
import leaseRouter from "./routes/leaseRouter";
import bookingRouter from "./routes/bookingRouter";
import transactionRouter from "./routes/transactionRouter";
import notificationRouter from "./routes/notificationRouter";
import reviewRouter from "./routes/reviewRouter";
import deleteFiles from "./utils/filesUtils";
import conversationRouter from "./routes/conversationRouter";
import path from "path";
import { Conversation } from "./models/conversationModel";
import { Server } from "socket.io";
import { AppDataSource } from "./config/data-source"; // Ensure correct import
import http from "http";
import { ObjectId } from "mongodb";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

// Swagger configuration
const options: swaggerJsdoc.Options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'My API',
      version: '1.0.0',
      description: 'API documentation for my app',
    },
  },
  apis: [path.join(__dirname, './routes/**/*.ts')],
};
const swaggerDocs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Route setups
app.use(authRouter);
app.use("/users", userRouter);
app.use("/properties", propertyRouter);
app.use("/maintenance", maintenanceRouter);
app.use("/leases", leaseRouter);
app.use("/bookings", bookingRouter);
app.use("/transactions", transactionRouter);
app.use("/notifications", notificationRouter);
app.use("/reviews", reviewRouter);
app.use("/messages", conversationRouter);

// Start database connection
AppDataSource.initialize()
  .then(() => {
    console.log("Connected to MongoDB!");
// connect and join a room event                         
    io.on("connection", (socket) => {
      console.log("User connected:", socket.id);

      socket.on("joinRoom", (conversationId) => {
        socket.join(conversationId);
      });



// event of sending message 


socket.on("sendMessage", async (data) => {
  try {
    // In a real app, senderId should be extracted from the token
    const { senderId, receiverId, content } = data;
    
    const conversationRepo = AppDataSource.getMongoRepository(Conversation);

    const senderObjectId = new ObjectId(senderId);
    const receiverObjectId = new ObjectId(receiverId);

    // Check if conversation exists
    let conversation = await conversationRepo.findOne({
      where: { participants: { $all: [senderObjectId, receiverObjectId] } },
    });

    if (!conversation) {
      console.log("Creating new conversation");
      conversation = await conversationRepo.save({
        participants: [senderObjectId, receiverObjectId], // Ensure IDs are ObjectId
        messages: [],
      });
    }

    console.log(conversation.id);

    // Create new message
    const newMessage = {
      senderId: senderObjectId,
      receiverId: receiverObjectId,
      content,
      createdAt: new Date(),
    };

    // Add message to conversation and save
    conversation.messages.push(newMessage);
    await conversationRepo.save(conversation);
    console.log("Saved to DB");

    // Emit the message to the conversation room
    io.to(conversation.id.toString()).emit("receiveMessage", newMessage);
  } catch (error) {
    console.error("Error sending message:", error);
  }
});



      // disconnet from the scket 
      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
      });
    });

    const PORT = 8000;
    server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch((error: any) => {
    console.error("Error connecting to MongoDB:", error);
  });
