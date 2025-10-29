import express from "express";
import { handleIncomingCall, handleSpeechResponse } from "../controllers/voiceController.js";
const router = express.Router();

router.post("/", handleIncomingCall);
router.post("/response", handleSpeechResponse);

export default router;
