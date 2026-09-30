const teamRepository = require("../repositories/teamRepository");
const builderRepository = require("../repositories/builderRepository");

const createTeam = async (
  problemId,
  teamName,
  builderId,
  userId
) => {
  if (!problemId || !teamName || !builderId || !userId) {
    throw new Error(
      "Problem ID, team name, and builder ID are required"
    );
  }

  const builder =
    await builderRepository.getBuilderById(builderId);

  if (!builder) {
    throw new Error("Builder not found");
  }

 const team =
  await teamRepository.createTeam(
    problemId,
    teamName,
    userId
  );
  await teamRepository.addTeamMember(
    team.id,
    builderId
  );

  return team;
};

const getTeamsByProblem = async (problemId) => {
  if (!problemId) {
    throw new Error("Problem ID is required");
  }

  return await teamRepository.getTeamByProblem(
    problemId
  );
};
const getAllTeams = async () => {
  return await teamRepository.getAllTeams();
};
const joinTeam = async (teamId, builderId) => {
  if (!teamId || !builderId) {
    throw new Error(
      "Team ID and builder ID are required"
    );
  }

  const builder =
    await builderRepository.getBuilderById(builderId);

  if (!builder) {
    throw new Error("Builder not found");
  }

  return await teamRepository.addTeamMember(
    teamId,
    builderId
  );
};
module.exports = {
  createTeam,
  getTeamsByProblem,
  joinTeam,
  getAllTeams,
};