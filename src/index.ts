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
import path from "path";

dotenv.config();

const app = express();

// Swagger configuration for development
const options: swaggerJsdoc.Options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'My API',
      version: '1.0.0',
      description: 'API documentation for my app',
    },
  },
  apis: [path.join(__dirname, './routes/**/*.ts')], // Use __dirname for an absolute path

 // Path to all route files for development (TypeScript files)
// Path to all route files for development (TypeScript files)
};

const swaggerDocs = swaggerJsdoc(options);
console.log(swaggerDocs); // Check if Swagger is picking up routes


// Set up Swagger UI at /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(cors());
app.use(express.json());

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

// Uncomment if needed in development for deleting files
/*
app.delete("/files", (req: Request, res: Response): void => {
  try {
    const { files } = req.body;
    if (!files || !Array.isArray(files)) {
      res.status(400).json({ error: "Invalid request. 'files' should be an array." });
      return;
    }
    const filePaths = files.map((file: { path: string }) => file.path);
    if (!filePaths.length) {
      res.status(400).json({ error: "No file paths provided." });
      return;
    }
    deleteFiles(filePaths);
    res.status(200).json({ message: "Files deleted successfully." });
  } catch (error) {
    console.error("Error deleting files:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
*/

app.use("/uploads", express.static("uploads"));

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
