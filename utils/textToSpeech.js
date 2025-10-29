import fs from "fs";
import textToSpeech from "@google-cloud/text-to-speech";

const client = new textToSpeech.TextToSpeechClient();

export const synthesizeSpeech = async (text, outputPath) => {
  const request = {
    input: { text },
    voice: { languageCode: "en-IN", ssmlGender: "FEMALE" },
    audioConfig: { audioEncoding: "MP3" },
  };

  const [response] = await client.synthesizeSpeech(request);
  fs.writeFileSync(outputPath, response.audioContent, "binary");
};
