const express = require("express");
const router = express.Router();

const {
  createDeposit,
  updateDepositStatus,
  getAllDeposits
} = require("../controllers/depositController");

// ROUTES
router.post("/create", createDeposit);
router.put("/update/:id", updateDepositStatus);
router.get("/all", getAllDeposits);

module.exports = router;
