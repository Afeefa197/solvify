const problemService = require("../services/problemService");

const createProblem = async (req, res) => {
  try {
    const {
  title,
  description,
  category,
} = req.body;
const createdBy = req.user.userId;

    const problem =
  await problemService.createProblem(
    title,
    description,
    category,
    createdBy
  );

    res.status(201).json({
      success: true,
      message: "Problem created successfully",
      problem,
    });
  } catch (error) {
    console.error(error);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllProblems = async (req, res) => {
  try {
    const problems =
      await problemService.getAllProblems();

    res.json({
      success: true,
      count: problems.length,
      problems,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch problems",
    });
  }
};

// DELETE PROBLEM
const deleteProblem = async (req, res) => {
  try {
    const { problemId } = req.params;

    const userId = req.user.userId;

const deletedProblem =
  await problemService.deleteProblem(
    problemId,
    userId
  );

    res.json({
      success: true,
      message: "Problem deleted successfully",
      problem: deletedProblem,
    });
  } catch (error) {
    console.error(error);

    if (error.message === "Problem not found") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createProblem,
  getAllProblems,
  deleteProblem,
};