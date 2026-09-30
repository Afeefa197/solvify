const express = require("express");
const matchingController = require("../controllers/matchingController");

const router = express.Router();

router.get(
  "/builders/:builderId",
  matchingController.getMatchingProblems
);

module.exports = router;