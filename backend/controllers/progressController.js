const progressService = require("../services/progressService");
const authMiddleware = require("../middleware/authMiddleware");

const createProgress = async (req, res) => {
  try {
    const { teamId, stage, description } = req.body;
    const userId = req.user.userId;

    const progress = await progressService.createProgress(
      teamId,
      stage,
      description,
      userId
    );

    res.status(201).json({
      success: true,
      progress,
    });
  } catch (error) {
    console.error("Create progress error:", error);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getProgressByTeam = async (req, res) => {
  try {
    const { teamId } = req.params;

    const progress =
      await progressService.getProgressByTeam(teamId);

    res.status(200).json({
      success: true,
      progress,
    });
  } catch (error) {
    console.error("Get progress error:", error);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const updateProgress = async (req, res) => {
  try {
    const { progressId } = req.params;
    const { stage, description } = req.body;
    const userId = req.user.userId;

    const progress =
      await progressService.updateProgress(
        progressId,
        stage,
        description,
        userId
      );

    res.status(200).json({
      success: true,
      progress,
    });
  } catch (error) {
    console.error("Update progress error:", error);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createProgress,
  getProgressByTeam,
  updateProgress,
};