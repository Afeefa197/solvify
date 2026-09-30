const dashboardRepository = require("../repositories/dashboardRepository");

const getDashboardStats = async () => {
  return await dashboardRepository.getDashboardStats();
};

module.exports = {
  getDashboardStats,
};