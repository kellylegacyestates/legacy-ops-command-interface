const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const OpenAI = require("openai");

const openaiKey = defineSecret("OPENAI_API_KEY");

exports.claude = onRequest(
  { secrets: [openaiKey], region: "us-central1" },
  async (req, res) => {
    res.set("Access-Control-Allow-Origin", "*");

    try {
      const client = new OpenAI({
        apiKey: openaiKey.value()
      });

      const input =
        req.body?.messages?.[0]?.content ||
        "Say PromptForge connected.";

      const response = await client.responses.create({
        model: "gpt-4o-mini",
        input
      });

      res.json({ output: response.output_text });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);
