const pool = require("../config/db");
const createBuilder = async (
  name,
  email,
  skills,
  bio,
  userId
) => {
  const result = await pool.query(
    `INSERT INTO builders (
  name,
  email,
  skills,
  bio,
  user_id
)
VALUES ($1, $2, $3, $4, $5)
RETURNING *`,
    [name, email, skills, bio, userId]
  );

  return result.rows[0];
};

const getAllBuilders = async () => {
  const result = await pool.query(
    `SELECT *
     FROM builders
     ORDER BY created_at DESC`
  );

  return result.rows;
};

const getBuilderById = async (builderId) => {
  const result = await pool.query(
    `SELECT *
     FROM builders
     WHERE id = $1`,
    [builderId]
  );

  return result.rows[0];
};

module.exports = {
  createBuilder,
  getAllBuilders,
  getBuilderById,
};