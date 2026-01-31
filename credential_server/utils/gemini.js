const axios = require("axios");

async function extractFromDescription(description) {
  const prompt = `
You are an expert technical recruiter.

Analyze the following project description and infer the intent.

Return ONLY valid JSON. No markdown. No explanation.

Output format:
{
  "projectType": "frontend | backend | fullstack | mobile | ml | data | general",
  "coreSkills": ["skill1", "skill2"],
  "secondarySkills": ["skill3", "skill4"],
  "summary": "one-line intent summary"
}

Project description:
"""
${description}
"""
`;

  const response = await axios.post(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
    {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.15,
        maxOutputTokens: 250,
      },
    },
    {
      params: { key: process.env.GEMINI_API_KEY },
      headers: { "Content-Type": "application/json" },
    },
  );

  const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) throw new Error("Empty Gemini response");

  const json = text.match(/\{[\s\S]*\}/);
  if (!json) throw new Error("Invalid Gemini JSON");

  return JSON.parse(json[0]);
}

module.exports = { extractFromDescription };
