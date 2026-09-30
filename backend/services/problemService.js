const problemRepository = require("../repositories/problemRepository");
const { structureProblem } = require("./aiService");

const createProblem = async (
  title,
  description,
  category,
  createdBy
) => {
  if (!title || !description) {
    throw new Error(
      "Title and description are required"
    );
  }

  const aiResult = await structureProblem(
    title,
    description
  );

  return await problemRepository.createProblem(
  title,
  description,
  category,
  aiResult,
  createdBy
);
};

const getAllProblems = async () => {
  return await problemRepository.getAllProblems();
};

// DELETE PROBLEM
const deleteProblem = async (problemId, userId) => {
  const deletedProblem =
    await problemRepository.deleteProblem(
      problemId,
      userId
    );

  if (!deletedProblem) {
    throw new Error("Problem not found");
  }

  return deletedProblem;
};

module.exports = {
  createProblem,
  getAllProblems,
  deleteProblem,
};