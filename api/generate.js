export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "This action is not available."
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
        error: "Please enter a topic first."
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error("KUDEX: GEMINI_API_KEY is missing");

      return res.status(500).json({
        error: "KUDEX AI is temporarily unavailable. Please try again later."
      });
    }

    const model =
      process.env.GEMINI_MODEL || "gemini-3.8-flash";

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
- Make the content engaging, original and useful.
- Make it suitable for the selected audience.
- Follow the requested tool.
- Keep the output ready to copy.
- Do not add unnecessary explanations.

Return only the requested creator content.
`;

    const url =
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    let lastStatus = 0;

    // Retry up to 3 times for temporary provider problems.
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
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
        lastStatus = response.status;

        if (response.ok) {
          const text =
            data?.candidates?.[0]?.content?.parts
              ?.map(part => part.text || "")
              .join("") || "";

          if (!text) {
            console.error("KUDEX: Empty AI response");

            return res.status(502).json({
              error: "KUDEX AI could not create a response. Please try again."
            });
          }

          return res.status(200).json({
            text
          });
        }

        // Temporary errors: retry automatically.
        const temporary =
          response.status === 408 ||
          response.status === 429 ||
          response.status >= 500;

        if (!temporary) {
          console.error(
            "KUDEX provider error:",
            response.status,
            data?.error?.message || "Unknown error"
          );

          return res.status(502).json({
            error: "KUDEX AI could not generate this right now. Please try again."
          });
        }

        if (attempt < 2) {
          await new Promise(resolve =>
            setTimeout(resolve, 1000 * (attempt + 1))
          );
        }

      } catch (networkError) {
        console.error("KUDEX network error:", networkError);

        if (attempt < 2) {
          await new Promise(resolve =>
            setTimeout(resolve, 1000 * (attempt + 1))
          );
        }
      }
    }

    console.error("KUDEX temporary failure:", lastStatus);

    return res.status(503).json({
      error: "KUDEX AI is busy right now. Please try again in a moment."
    });

  } catch (error) {
    console.error("KUDEX server error:", error);

    return res.status(500).json({
      error: "Something went wrong. Please try again."
    });
  }
}
