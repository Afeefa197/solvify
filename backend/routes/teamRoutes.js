const express = require("express");

const teamController =
  require("../controllers/teamController");
  const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  teamController.createTeam
);
router.post(
  "/join",
  teamController.joinTeam
);
router.get(
  "/problem/:problemId",
  teamController.getTeamsByProblem
);
router.get(
  "/",
  teamController.getAllTeams
);

module.exports = router;