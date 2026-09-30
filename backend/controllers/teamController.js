const teamService = require("../services/teamService");

const createTeam = async (req, res) => {
  try {
    const {
      problemId,
      teamName,
      builderId,
    } = req.body;
    const userId = req.user.userId;

    const team =
  await teamService.createTeam(
    problemId,
    teamName,
    builderId,
    userId
  );
    res.status(201).json({
      success: true,
      message: "Team created successfully",
      team,
    });
  } catch (error) {
    console.error("Team creation error:", error);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getTeamsByProblem = async (req, res) => {
  try {
    const { problemId } = req.params;

    const teams =
      await teamService.getTeamsByProblem(
        problemId
      );

    res.json({
      success: true,
      count: teams.length,
      teams,
    });
  } catch (error) {
    console.error("Team fetch error:", error);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
const getAllTeams = async (req, res) => {
  try {
    const teams = await teamService.getAllTeams();

    res.json({
      success: true,
      count: teams.length,
      teams,
    });
  } catch (error) {
    console.error("Get all teams error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch teams",
    });
  }
};
const joinTeam = async (req, res) => {
  try {
    const {
      teamId,
      builderId,
    } = req.body;

    const teamMember =
      await teamService.joinTeam(
        teamId,
        builderId
      );

    res.status(201).json({
      success: true,
      message: "Joined team successfully",
      teamMember,
    });
  } catch (error) {
    console.error(
      "Join team error:",
      error
    );

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createTeam,
  getTeamsByProblem,
  joinTeam,
  getAllTeams,
};