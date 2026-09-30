const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");

const builderController =
  require("../controllers/builderController");

const router = express.Router();
router.post(
  "/",
  authMiddleware,
  builderController.createBuilder
);
router.get(
  "/",
  builderController.getAllBuilders
);

router.get(
  "/:builderId",
  builderController.getBuilderById
);

module.exports = router;