export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      tool,
      topic,
      language,
      audience,
      style,
      length
    } = req.body || {};

    if (!topic) {
      return res.status(400).json({ error: "Topic is required" });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        error: "OPENAI_API_KEY is not configured"
      });
    }

    const prompt = `
You are KUDEX AI, a creator toolkit for YouTube Shorts.

Create content using these settings:

Tool: ${tool || "Shorts Script"}
Topic: ${topic}
Language: ${language || "English"}
Audience: ${audience || "Global"}
Style: ${style || "Viral & high-retention"}
Length: ${length || "30 seconds"}

Follow the selected language naturally.
Make the content engaging, clear, original and suitable for the selected audience.

Return only the requested creator content. Do not add unnecessary explanations.
`;

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-5-mini",
        input: prompt
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data?.error?.message || "OpenAI request failed"
      });
    }

    return res.status(200).json({
      text: data.output_text || ""
    });

  } catch (error) {
    return res.status(500).json({
      error: error?.message || "Server error"
    });
  }
}
