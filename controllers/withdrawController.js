const db = require("../db/index");

const createWithdrawRequest = (req, res) => {
  const { user_id, amount, method } = req.body;

  if (!user_id || !amount || !method) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const sql = "INSERT INTO withdrawals (user_id, amount, method) VALUES (?, ?, ?)";
  db.query(sql, [user_id, amount, method], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Failed to submit withdrawal", error: err.message });
    }
    res.status(201).json({ message: "Withdrawal request submitted", withdrawalId: result.insertId });
  });
};

module.exports = { createWithdrawRequest };

const updateWithdrawStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["approved", "rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  // 1. First, get the withdrawal request
  const getWithdrawal = "SELECT * FROM withdrawals WHERE id = ?";
  db.query(getWithdrawal, [id], (err, result) => {
    if (err) return res.status(500).json({ message: "DB error", error: err.message });
    if (result.length === 0) return res.status(404).json({ message: "Withdrawal request not found" });

    const withdrawal = result[0];

    // Log transaction after wallet deduction
const txnSQL = `
  INSERT INTO transactions (user_id, type, amount, status)
  VALUES (?, 'withdraw', ?, 'success')
`;
db.query(txnSQL, [withdrawal.user_id, withdrawal.amount], (txnErr) => {
  if (txnErr) {
    console.error("Transaction log failed:", txnErr.message);
    // Proceed anyway
  }
});

    // 2. If approved, deduct from wallet
    if (status === "approved") {
      const updateWallet = `
        UPDATE wallets 
        SET balance = balance - ? 
        WHERE user_id = ? AND balance >= ?`;

      db.query(updateWallet, [withdrawal.amount, withdrawal.user_id, withdrawal.amount], (err2, result2) => {
        if (err2) return res.status(500).json({ message: "Wallet update failed", error: err2.message });
        if (result2.affectedRows === 0) {
          return res.status(400).json({ message: "Insufficient wallet balance" });
        }

        // 3. Now update the withdrawal status
        const updateStatus = "UPDATE withdrawals SET status = ? WHERE id = ?";
        db.query(updateStatus, [status, id], (err3) => {
          if (err3) return res.status(500).json({ message: "Failed to update withdrawal status", error: err3.message });

          res.status(200).json({ message: "Withdrawal approved and wallet updated" });
        });
      });
    } else {
      // If rejected, just update status
      const updateStatus = "UPDATE withdrawals SET status = ? WHERE id = ?";
      db.query(updateStatus, [status, id], (err4) => {
        if (err4) return res.status(500).json({ message: "Failed to update withdrawal status", error: err4.message });

        res.status(200).json({ message: "Withdrawal rejected" });
      });
    }
  });
};



module.exports = {
  createWithdrawRequest,
  updateWithdrawStatus
};