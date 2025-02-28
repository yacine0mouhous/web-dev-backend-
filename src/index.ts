import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import "reflect-metadata";

import authRouter from "./routes/authRouter";
import userRouter from "./routes/userRouter";
import propertyRouter from "./routes/propertyRouter";
import maintenanceRouter from "./routes/maintenanceRouter";
import leaseRouter from "./routes/leaseRouter";
import bookingRouter from "./routes/bookingRouter";
import transactionRouter from "./routes/transactionRouter";
import notificationRouter from "./routes/notificationRouter";
import reviewRouter from "./routes/reviewRouter";


dotenv.config();

const app = express();




app.use(cors());
app.use(express.json());
app.use(authRouter);
app.use('/users', userRouter);          
app.use('/properties', propertyRouter); 
app.use('/maintenance', maintenanceRouter);
app.use('/leases', leaseRouter);       
app.use('/bookings', bookingRouter); 
app.use('/transactions', transactionRouter);
app.use('/notifications', notificationRouter);
app.use('/reviews', reviewRouter);



const PORT =5000;  /* process.env.PORT || */
app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));
