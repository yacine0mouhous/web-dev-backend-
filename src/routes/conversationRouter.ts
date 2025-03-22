import { Router } from "express";
import { MessageController } from "../controllers/conversationController";

const router = Router();

router.post("/send", MessageController.sendMessage);
router.get("/:conversationId", MessageController.getMessages);

export default router;
