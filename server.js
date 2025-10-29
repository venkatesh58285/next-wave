import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import voiceRoute from "./routes/voiceRoute.js";

dotenv.config();
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public")); // so mp3 files are served
app.use("/voice", voiceRoute);

app.get("/", (req, res) => res.send("Voice Edu Assistant is running 🚀"));

app.listen(process.env.PORT || 3000, () =>
  console.log(`Server running on port ${process.env.PORT || 3000}`)
);
