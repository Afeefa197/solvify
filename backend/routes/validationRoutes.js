const express = require("express");
const validationController = require("../controllers/validationController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/:problemId",
  authMiddleware,
  validationController.validateProblem
);

router.get("/:problemId", validationController.getValidationCount);

module.exports = router;