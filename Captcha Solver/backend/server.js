import express from "express";
import multer from "multer";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";

import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

// POST /api/analyze
app.post("/api/analyze", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    const imgBuffer = req.file.buffer.toString("base64");

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent([
      {
        inlineData: {
          data: imgBuffer,
          mimeType: req.file.mimetype,
        },
      },
      "solve captcha and give captcha only(NO ANY EXTRA TEXT JUST CAPTCHA)"
    ]);

    const text = result.response.text();
    res.json({ output: text });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// EXPORT handler for Vercel
export default app;
