const builderRepository = require("../repositories/builderRepository");
const pool = require("../config/db");

const getMatchingProblems = async (builderId) => {
  const builder =
    await builderRepository.getBuilderById(builderId);

  if (!builder) {
    throw new Error("Builder not found");
  }

  const builderSkills = builder.skills.map((skill) =>
  skill.toLowerCase().trim()
);

const skillMappings = {
  "database management": [
    "postgresql",
    "mysql",
    "mongodb",
    "sql",
  ],

  "full-stack web development": [
    "react",
    "node.js",
    "javascript",
    "express",
  ],

  "data analytics": [
    "python",
    "sql",
    "data analytics",
    "data analysis",
  ],

  "machine learning": [
    "python",
    "machine learning",
  ],

  "time series forecasting": [
    "python",
    "machine learning",
    "data analytics",
  ],
};

  const result = await pool.query(
    `SELECT *
     FROM problems
     WHERE required_skills IS NOT NULL
     ORDER BY created_at DESC`
  );

  const matchingProblems = result.rows
    .map((problem) => {
      const requiredSkills =
        problem.required_skills.map((skill) =>
          skill.toLowerCase().trim()
        );

      const matchedSkills = requiredSkills.filter((skill) => {
  if (builderSkills.includes(skill)) {
    return true;
  }

  const relatedSkills = skillMappings[skill] || [];

  return relatedSkills.some((relatedSkill) =>
    builderSkills.includes(relatedSkill)
  );
});
const missingSkills = requiredSkills.filter(
  (skill) => !matchedSkills.includes(skill)
);

      const matchPercentage =
        requiredSkills.length === 0
          ? 0
          : Math.round(
              (matchedSkills.length /
                requiredSkills.length) *
                100
            );

     return {
  ...problem,
  matchedSkills,
  missingSkills,
  matchPercentage,
};
    })
    .filter(
      (problem) =>
        problem.matchPercentage > 0
    )
    .sort(
      (a, b) =>
        b.matchPercentage -
        a.matchPercentage
    );

  return matchingProblems;
};

module.exports = {
  getMatchingProblems,
};