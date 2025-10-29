import fs from "fs";
import speech from "@google-cloud/speech";

const client = new speech.SpeechClient();

export const recognizeSpeech = async (audioFilePath) => {
  const audioBytes = fs.readFileSync(audioFilePath).toString("base64");

  const request = {
    config: {
      encoding: "WEBM_OPUS",
      languageCode: "en-US",
      enableAutomaticPunctuation: true,
    },
    audio: {
      content: audioBytes,
    },
  };

  const [response] = await client.recognize(request);
  const transcription = response.results
    ?.map((r) => r.alternatives?.[0]?.transcript)
    ?.filter(Boolean)
    ?.join(" ") || "";

  return transcription;
};

