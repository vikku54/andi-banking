// routes/adminDepositsRoutes.js
const express = require("express");
const router = express.Router();
const { getAllDeposits, updateDepositStatus } = require("../controllers/adminDepositsController");

// GET all deposits (admin side)
router.get("/", getAllDeposits);

// UPDATE deposit status (approve/reject)
router.put("/:id/status", updateDepositStatus);

module.exports = router;
