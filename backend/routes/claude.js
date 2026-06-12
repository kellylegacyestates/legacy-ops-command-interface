import express from "express";
import OpenAI from "openai";

const router = express.Router();

router.post("/claude", async (req, res) => {
  try {
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const response = await client.models.list();

    res.json({
      output: `PromptForge connected. Models available: ${response.data.length}`
    });
  } catch (error) {
    res.status(500).json({
      error: "PromptForge failed",
      detail: error.message
    });
  }
});

export default router;
