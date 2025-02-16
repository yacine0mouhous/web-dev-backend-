import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import "reflect-metadata";


import { stripe } from "./utils/stripe";
import { verifyAuth } from "./middlewares/authMiddleware";
import { default as authRouter } from "./routes/authRouter";
import verifier_router from "./routes/protected";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(authRouter);
app.use(verifier_router)



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
