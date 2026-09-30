const pool = require("../config/db");

const createTeam = async (
  problemId,
  teamName,
  userId
) => {
  const result = await pool.query(
    `INSERT INTO teams (
  problem_id,
  team_name,
  created_by
)
VALUES ($1, $2, $3)
     RETURNING *`,
    [problemId, teamName, userId]
  );

  return result.rows[0];
};

const addTeamMember = async (teamId, builderId) => {
  const result = await pool.query(
    `INSERT INTO team_members (team_id, builder_id)
     VALUES ($1, $2)
     RETURNING *`,
    [teamId, builderId]
  );

  return result.rows[0];
};

const getTeamByProblem = async (problemId) => {
  const result = await pool.query(
    `SELECT
        t.id,
        t.problem_id,
        t.team_name,
        t.created_at,
        COUNT(tm.builder_id) AS member_count,
        COALESCE(
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'builderId', b.id,
              'name', b.name,
              'skills', b.skills
            )
          ) FILTER (WHERE b.id IS NOT NULL),
          '[]'
        ) AS members
     FROM teams t
     LEFT JOIN team_members tm
       ON t.id = tm.team_id
     LEFT JOIN builders b
       ON tm.builder_id = b.id
     WHERE t.problem_id = $1
     GROUP BY
        t.id,
        t.problem_id,
        t.team_name,
        t.created_at
     ORDER BY t.created_at DESC`,
    [problemId]
  );

  return result.rows;
};
const getAllTeams = async () => {
  const result = await pool.query(
    `SELECT
        t.id,
        t.problem_id,
        t.team_name,
        t.created_at,
        p.title AS problem_title,
        COUNT(tm.builder_id) AS member_count
     FROM teams t
     JOIN problems p
       ON t.problem_id = p.id
     LEFT JOIN team_members tm
       ON t.id = tm.team_id
     GROUP BY
        t.id,
        t.problem_id,
        t.team_name,
        t.created_at,
        p.title
     ORDER BY t.created_at DESC`
  );

  return result.rows;
};
module.exports = {
  createTeam,
  addTeamMember,
  getTeamByProblem,
  getAllTeams,
};