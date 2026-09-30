const matchingService = require("../services/matchingService");

const getMatchingProblems = async (req, res) => {
  try {
    const { builderId } = req.params;

    const problems =
      await matchingService.getMatchingProblems(
        builderId
      );

    res.json({
      success: true,
      count: problems.length,
      problems,
    });
  } catch (error) {
    console.error(
      "Matching error:",
      error
    );

    if (error.message === "Builder not found") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to find matching problems",
    });
  }
};

module.exports = {
  getMatchingProblems,
};