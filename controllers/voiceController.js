import twilio from "twilio";
import fetch from "node-fetch";
import { recognizeSpeech } from "../utils/speechToText.js";
import { synthesizeSpeech } from "../utils/textToSpeech.js";
import path from "path";
import fs from "fs";

const __dirname = process.cwd();
const VoiceResponse = twilio.twiml.VoiceResponse;

async function generateAnswer(question) {
  const res = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" +
      process.env.GEMINI_API_KEY,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: question }] }] }),
    }
  );
  const data = await res.json();
  return (
    data?.candidates?.[0]?.content?.parts?.[0]?.text ||
    "Sorry, I couldn’t find an answer."
  );
}

export const handleBrowserAudioUpload = async (req, res) => {
  try {
    if (!req.file?.path) {
      return res.status(400).json({ error: "No audio file uploaded" });
    }

    const question = await recognizeSpeech(req.file.path);
    const answer = await generateAnswer(question || "Explain the question could not be recognized.");

    const responsesDir = path.join(process.cwd(), "public", "responses");
    if (!fs.existsSync(responsesDir)) fs.mkdirSync(responsesDir, { recursive: true });

    const outputPath = path.join(responsesDir, `answer-${Date.now()}.mp3`);
    await synthesizeSpeech(answer, outputPath);

    res.setHeader("Content-Type", "audio/mpeg");
    fs.createReadStream(outputPath).pipe(res);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Processing failed" });
  } finally {
    if (req.file?.path) {
      fs.unlink(req.file.path, () => {});
    }
  }
};

export const handleIncomingCall = async (req, res) => {
  const twiml = new VoiceResponse();

  // Step 1: Prompt the user to ask a question
  const gather = twiml.gather({
    input: "speech",
    action: "/voice/response",
    speechTimeout: "auto",
  });
  gather.say("Hello! Please ask your education question after the beep.");

  res.type("text/xml");
  res.send(twiml.toString());
};

export const handleSpeechResponse = async (req, res) => {
    const VoiceResponse = twilio.twiml.VoiceResponse;
    const twiml = new VoiceResponse();
  
    try {
      const userSpeech = req.body.SpeechResult;
      console.log("User asked:", userSpeech);
  
      // Step 2: Get answer from Gemini
      const answer = await generateAnswer(userSpeech);
      console.log("Gemini Answer:", answer);
  
      // Step 3: Convert answer to speech
      const audioFile = path.join(__dirname, "public", "responses", "answer.mp3");
      await synthesizeSpeech(answer, audioFile);
  
      // Step 4: Play the generated audio to caller
      twiml.play(`${process.env.BASE_URL}/responses/answer.mp3`);
  
    } catch (err) {
      console.error("Error:", err);
      twiml.say("Sorry, something went wrong. Please try again later.");
    }
  
    res.type("text/xml");
    res.send(twiml.toString());
  };
  