const pool = require("../config/db");

const getDashboardStats = async () => {
  const result = await pool.query(`
    SELECT
      (SELECT COUNT(*) FROM problems) AS total_problems,
      (SELECT COUNT(*) FROM problem_validations) AS total_validations,
      (SELECT COUNT(*) FROM builders) AS total_builders,
      (SELECT COUNT(*) FROM teams) AS total_teams,
      (SELECT COUNT(*) FROM prototype_progress) AS total_progress_records
  `);
  const categoryResult = await pool.query(`
  SELECT
    category,
    COUNT(*) AS count
  FROM problems
  WHERE category IS NOT NULL
  GROUP BY category
  ORDER BY count DESC
`);
const stageResult = await pool.query(`
  SELECT
    stage,
    COUNT(*) AS count
  FROM prototype_progress
  GROUP BY stage
  ORDER BY count DESC
`);

return {
  total_problems: Number(result.rows[0].total_problems),
  total_validations: Number(result.rows[0].total_validations),
  total_builders: Number(result.rows[0].total_builders),
  total_teams: Number(result.rows[0].total_teams),
  total_progress_records: Number(
    result.rows[0].total_progress_records
  ),
  categories: categoryResult.rows.map((item) => ({
    category: item.category,
    count: Number(item.count),
  })),
  stages: stageResult.rows.map((item) => ({
    stage: item.stage,
    count: Number(item.count),
  })),
};
};

module.exports = {
  getDashboardStats,
};