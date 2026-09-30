const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const structureProblem = async (title, description) => {
  const prompt = `
You are an AI assistant for SOLVIFY.

SOLVIFY converts real-world problems into structured engineering challenges.

Analyze this problem:

Title:
${title}

Description:
${description}

Return ONLY valid JSON in exactly this format:

{
  "problemStatement": "",
  "category": "",
  "affectedUsers": [],
  "requiredSkills": [],
  "difficulty": "",
  "expectedSolutionArea": ""
}

Rules:
- problemStatement: Rewrite the problem clearly in 1-2 sentences.
- category: Choose the most suitable category.
- affectedUsers: List the people affected.
- requiredSkills: List relevant technical skills.
- difficulty: Only "Easy", "Medium", or "Hard".
- expectedSolutionArea: Suggest the general area where a solution could be developed.
- Do not give a specific final solution.
`;

  try {
  const interaction = await ai.interactions.create({
    model: "gemini-3.8-flash",
    input: prompt,
  });

  const text = interaction.output_text;

  return JSON.parse(text);

} catch (error) {

  if (error.status === 429 || error.message?.includes("429")) {
    console.log("Gemini rate limit reached. Using demo fallback.");

    return {
      problemStatement:
        `${title} is a real-world problem that affects users and requires a practical technology-based solution.`,

      category:
        "Environment",

      affectedUsers: [
        "Students",
        "College staff",
        "Institution"
      ],

      requiredSkills: [
        "Data Analysis",
        "Machine Learning",
        "Web Development",
        "Database Management"
      ],

      difficulty:
        "Medium",

      expectedSolutionArea:
        "Data-driven application for monitoring, analysis, and optimization"
    };
  }

  throw error;
}
};

module.exports = {
  structureProblem,
};