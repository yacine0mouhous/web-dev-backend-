import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { stripe } from "./utils/stripe";
import { verifyAuth } from "./middlewares/authMiddleware";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
