const builderService = require("../services/builderService");

const createBuilder = async (req, res) => {
  try {
    const {
      name,
      email,
      skills,
      bio,
    } = req.body;
    const userId = req.user.userId;

    const builder =
  await builderService.createBuilder(
    name,
    email,
    skills,
    bio,
    userId
  );

    res.status(201).json({
      success: true,
      message: "Builder profile created successfully",
      builder,
    });
  } catch (error) {
    console.error(error);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllBuilders = async (req, res) => {
  try {
    const builders =
      await builderService.getAllBuilders();

    res.json({
      success: true,
      count: builders.length,
      builders,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch builders",
    });
  }
};

const getBuilderById = async (req, res) => {
  try {
    const { builderId } = req.params;

    const builder =
      await builderService.getBuilderById(
        builderId
      );

    res.json({
      success: true,
      builder,
    });
  } catch (error) {
    console.error(error);

    if (error.message === "Builder not found") {
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
  createBuilder,
  getAllBuilders,
  getBuilderById,
};