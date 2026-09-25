export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
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

    if (!topic || !topic.trim()) {
      return res.status(400).json({
        error: "Topic is required"
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "GEMINI_API_KEY is not configured"
      });
    }

    const prompt = `
You are KUDEX AI, a professional creator toolkit for YouTube creators.

Create content using these settings:

Tool: ${tool || "Shorts Script"}
Topic: ${topic}
Language: ${language || "English"}
Audience: ${audience || "Global"}
Style: ${style || "Viral & high-retention"}
Length: ${length || "30 seconds"}

Requirements:
- Follow the selected language naturally.
- Make the content engaging and original.
- Make it suitable for the selected audience.
- Follow the requested tool.
- Keep the output useful and ready to copy.
- Do not add unnecessary explanations.

Return only the requested creator content.
`;

    const model =
      process.env.GEMINI_MODEL || "gemini-2.5-flash";

    const url =
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error:
          data?.error?.message ||
          "Gemini API request failed"
      });
    }

    const text =
      data?.candidates?.[0]?.content?.parts
        ?.map(part => part.text || "")
        .join("") || "";

    if (!text) {
      return res.status(500).json({
        error: "Gemini returned an empty response"
      });
    }

    return res.status(200).json({
      text
    });

  } catch (error) {
    return res.status(500).json({
      error: error?.message || "Server error"
    });
  }
        }
