const express = require("express");
const router = express.Router();
const { getAllWithdrawals, updateWithdrawalStatus } = require("../controllers/adminWithdrawalController");

// Routes
router.get("/", getAllWithdrawals);
router.put("/:id", updateWithdrawalStatus);

module.exports = router;
