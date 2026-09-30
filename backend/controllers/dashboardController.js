const dashboardService = require("../services/dashboardService");

const getDashboardStats = async (req, res) => {
  try {
    const stats =
      await dashboardService.getDashboardStats();

    res.status(200).json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error("Dashboard error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load dashboard statistics",
    });
  }
};

module.exports = {
  getDashboardStats,
};