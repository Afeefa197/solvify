const validationService = require("../services/validationService");

const validateProblem = async (req, res) => {
  try {
    const { problemId } = req.params;
    const userId = req.user.userId;

    const validation =
  await validationService.validateProblem(
    problemId,
    userId
  );

    const count =
      await validationService.getValidationCount(problemId);

    res.status(201).json({
      success: true,
      message: "Problem validated successfully",
      validation,
      validationCount: count,
    });
  } catch (error) {
    console.error(error);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getValidationCount = async (req, res) => {
  try {
    const { problemId } = req.params;

    const count =
      await validationService.getValidationCount(problemId);

    res.json({
      success: true,
      validationCount: count,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to get validation count",
    });
  }
};

module.exports = {
  validateProblem,
  getValidationCount,
};