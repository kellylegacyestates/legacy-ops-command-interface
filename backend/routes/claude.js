import express from "express";

const router = express.Router();

router.post("/claude", async (req, res) => {
  try {
    const { messages, systemPrompt } = req.body;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5",
        max_tokens: 1500,
        system: systemPrompt || "You are PromptForge Pro inside Legacy Access.",
        messages
      })
    });

    const data = await response.json();

    res.json({
      output: data.content?.map((x) => x.text).join("") || "",
      raw: data
    });
  } catch (error) {
    console.error("PromptForge error:", error);
    res.status(500).json({ error: "PromptForge failed" });
  }
});

export default router;

