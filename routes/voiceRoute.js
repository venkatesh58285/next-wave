import express from "express";
import multer from "multer";
import { handleIncomingCall, handleSpeechResponse, handleBrowserAudioUpload } from "../controllers/voiceController.js";
const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("audio"), handleBrowserAudioUpload);
router.post("/twilio", handleIncomingCall);
router.post("/response", handleSpeechResponse);

export default router;
