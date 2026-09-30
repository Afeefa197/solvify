const validationRepository = require("../repositories/validationRepository");

const validateProblem = async (problemId, userId) => {
  if (!problemId) {
    throw new Error("Problem ID is required");
  }

  return await validationRepository.validateProblem(
  problemId,
  userId
);
};

const getValidationCount = async (problemId) => {
  if (!problemId) {
    throw new Error("Problem ID is required");
  }

  return await validationRepository.getValidationCount(problemId);
};

module.exports = {
  validateProblem,
  getValidationCount,
};
