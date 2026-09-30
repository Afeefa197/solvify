const pool = require("../config/db");
const createProgress = async (
  teamId,
  stage,
  description,
  userId
) => {
  const result = await pool.query(
    `INSERT INTO prototype_progress (
  team_id,
  stage,
  description,
  updated_by
)
VALUES ($1, $2, $3, $4)
    RETURNING *`,
    [teamId, stage, description, userId]
  );

  return result.rows[0];
};

const getProgressByTeam = async (teamId) => {
  const result = await pool.query(
    `SELECT *
     FROM prototype_progress
     WHERE team_id = $1
     ORDER BY updated_at DESC`,
    [teamId]
  );

  return result.rows;
};

const updateProgress = async (
  progressId,
  stage,
  description,
  userId

) => {
  const result = await pool.query(
    `UPDATE prototype_progress
     SET
  stage = $1,
  description = $2,
  updated_by = $4,
  updated_at = CURRENT_TIMESTAMP
     WHERE id = $3
     RETURNING *`,
    [stage, description, progressId, userId]
  );

  return result.rows[0];
};

module.exports = {
  createProgress,
  getProgressByTeam,
  updateProgress,
};