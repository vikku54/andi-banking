const express = require("express");
const router = express.Router();
const {
  createWithdrawRequest,
  updateWithdrawStatus
} = require("../controllers/withdrawController");

router.post("/create", createWithdrawRequest);

// Admin updates status here 👇
router.put("/update/:id", updateWithdrawStatus);

module.exports = router;
