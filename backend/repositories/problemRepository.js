const pool = require("../config/db");

const createProblem = async (
  title,
  description,
  category,
  aiResult,
  createdBy
) => {
  const result = await pool.query(
    `INSERT INTO problems (
  title,
  description,
  category,
  problem_statement,
  affected_users,
  required_skills,
  difficulty,
  expected_solution_area,
  created_by
)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *`,
    [
  title,
  description,
  aiResult.category,
  aiResult.problemStatement,
  aiResult.affectedUsers,
  aiResult.requiredSkills,
  aiResult.difficulty,
  aiResult.expectedSolutionArea,
  createdBy,
]
  );

  return result.rows[0];
};

const getAllProblems = async () => {
  const result = await pool.query(
    `SELECT * FROM problems
     ORDER BY created_at DESC`
  );

  return result.rows;
};

// DELETE PROBLEM
const deleteProblem = async (problemId, userId) => {
  const result = await pool.query(
    `DELETE FROM problems
     WHERE id = $1 AND created_by = $2
     RETURNING *`,
    [problemId, userId]
  );

  return result.rows[0];
};

module.exports = {
  createProblem,
  getAllProblems,
  deleteProblem,
};