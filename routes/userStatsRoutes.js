const express = require("express");
const router = express.Router();
const { getUserStats } = require("../controllers/userStatsController");

// GET /api/user-stats/:userId
router.get("/:userId", getUserStats);

module.exports = router;



