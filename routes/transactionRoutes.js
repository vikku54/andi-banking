const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController");

// Get all transactions
router.get("/", transactionController.getAllTransactions);

// Add new transaction
router.post("/", transactionController.addTransaction);

// (Optional) - Update transaction
router.put("/:id", transactionController.updateTransaction);

// (Optional) - Delete transaction
router.delete("/:id", transactionController.deleteTransaction);

module.exports = router;
