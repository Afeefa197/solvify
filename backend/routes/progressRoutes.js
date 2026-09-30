const express = require("express");
const progressController = require("../controllers/progressController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  progressController.createProgress
);

router.get(
  "/team/:teamId",
  progressController.getProgressByTeam
);

router.put(
  "/:progressId",
  authMiddleware,
  progressController.updateProgress
);

module.exports = router;