import { GoogleGenAI } from "@google/genai";
import express from "express";
import path from "path";

const ai = new GoogleGenAI({apiKey: "AIzaSyAS_sEKbBb7DWb1IYthbmxPwgS9Vi1zilI"});

const app = express();
app.use(express.json());
app.use(express.static('.'));

app.get('/', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'index.html'));
});

app.post("/gemini", async (req, res) => {
  const prompt = req.body.prompt;
  console.log('Received prompt:', prompt);
  try {
    const response = await main(prompt);
    console.log('Response:', response.text);
    res.json({ text: response.text });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: error.message });
  }
});

async function main(prompt) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-pro",
      contents: prompt,
    });
    return response;
  } catch (error) {
    console.error('API Error:', error);
    // Fallback if API fails
    return {
      text: `I'm sorry, but I'm currently unable to connect to the AI service. Your question was: "${prompt}". Please try again later.`
    };
  }
}

// Listen to port 3000
app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});