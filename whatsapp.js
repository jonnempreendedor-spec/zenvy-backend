import express from "express";
import { verifyWebhook, receiveWebhook } from "../controllers/whatsappController.js";

const router = express.Router();

router.get("/webhook/whatsapp", verifyWebhook);
router.post("/webhook/whatsapp", receiveWebhook);

export default router;