import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import voiceRoute from "./routes/voiceRoute.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
// Required to resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure Google credentials path if not set
if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  process.env.GOOGLE_APPLICATION_CREDENTIALS = path.join(process.cwd(), "google-credentials.json");
}

// Ensure responses dir exists
const responsesDir = path.join(process.cwd(), "public", "responses");
if (!fs.existsSync(responsesDir)) fs.mkdirSync(responsesDir, { recursive: true });

// Serve frontend and static audio
app.use(express.static(path.join(__dirname, "public")));
app.use("/voice", voiceRoute);

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));

app.listen(process.env.PORT || 3000, () =>
  console.log(`Server running on port ${process.env.PORT || 3000}`)
);
