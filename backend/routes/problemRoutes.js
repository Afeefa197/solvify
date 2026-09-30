const authMiddleware = require("../middleware/authMiddleware");
const express = require("express");


const problemController = require(
  "../controllers/problemController"
);

const router = express.Router();

// CREATE PROBLEM
router.post(
  "/",
  authMiddleware,
  problemController.createProblem
);
// GET ALL PROBLEMS
router.get(
  "/",
  problemController.getAllProblems
);

// DELETE PROBLEM
router.delete(
  "/:problemId",
  authMiddleware,
  problemController.deleteProblem
);
module.exports = router;