const progressRepository = require("../repositories/progressRepository");

const createProgress = async (
  teamId,
  stage,
  description,
   userId
) => {
  if (!teamId) {
    throw new Error("Team ID is required");
  }

  if (!stage) {
    throw new Error("Progress stage is required");
  }

  return await progressRepository.createProgress(
    teamId,
    stage,
    description,
     userId
  );
};

const getProgressByTeam = async (teamId) => {
  if (!teamId) {
    throw new Error("Team ID is required");
  }

  return await progressRepository.getProgressByTeam(
    teamId
  );
};

const updateProgress = async (
  progressId,
  stage,
  description,
  userId
) => {
  if (!progressId) {
    throw new Error("Progress ID is required");
  }

  if (!stage) {
    throw new Error("Progress stage is required");
  }

  return await progressRepository.updateProgress(
    progressId,
    stage,
    description,
     userId
  );
};

module.exports = {
  createProgress,
  getProgressByTeam,
  updateProgress,
};