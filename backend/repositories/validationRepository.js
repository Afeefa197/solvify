const pool = require("../config/db");

const validateProblem = async (problemId, userId) => {
  try {
    const result = await pool.query(
      `INSERT INTO problem_validations (problem_id, user_id)
       VALUES ($1, $2)
       RETURNING *`,
      [problemId, userId]
    );

    return result.rows[0];
  } catch (error) {
    if (error.code === "23505") {
      throw new Error("You have already validated this problem");
    }

    throw error;
  }
};

const getValidationCount = async (problemId) => {
  const result = await pool.query(
    `SELECT COUNT(*) AS count
     FROM problem_validations
     WHERE problem_id = $1`,
    [problemId]
  );

  return Number(result.rows[0].count);
};

module.exports = {
  validateProblem,
  getValidationCount,
};