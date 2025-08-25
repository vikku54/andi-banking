const db = require("../db/index");

// Create a new deposit request
const createDeposit = (req, res) => {
  const { user_id, amount, method } = req.body;

  if (!user_id || !amount || !method) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const sql = "INSERT INTO deposits (user_id, amount, method) VALUES (?, ?, ?)";
  db.query(sql, [user_id, amount, method], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Failed to create deposit", error: err.message });
    }
    res.status(201).json({ message: "Deposit request submitted", depositId: result.insertId });
  });
};

// Admin updates the deposit status (approve or reject)
const updateDepositStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["approved", "rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const getDeposit = "SELECT * FROM deposits WHERE id = ?";
  db.query(getDeposit, [id], (err, result) => {
    if (err) return res.status(500).json({ message: "DB error", error: err.message });
    if (result.length === 0) return res.status(404).json({ message: "Deposit not found" });

    const deposit = result[0];

    // Log transaction after wallet update
const txnSQL = `
  INSERT INTO transactions (user_id, type, amount, status)
  VALUES (?, 'deposit', ?, 'success')
`;
db.query(txnSQL, [deposit.user_id, deposit.amount], (txnErr) => {
  if (txnErr) {
    console.error("Transaction log failed:", txnErr.message);
    // Don't return error here since wallet was already updated
  }
});

    if (status === "approved") {
      const updateWallet = `
        INSERT INTO wallets (user_id, balance)
        VALUES (?, ?)
        ON DUPLICATE KEY UPDATE balance = balance + VALUES(balance)
      `;
      db.query(updateWallet, [deposit.user_id, deposit.amount], (err2) => {
        if (err2) return res.status(500).json({ message: "Wallet update failed", error: err2.message });

        const updateStatus = "UPDATE deposits SET status = ? WHERE id = ?";
        db.query(updateStatus, [status, id], (err3) => {
          if (err3) return res.status(500).json({ message: "Failed to update deposit", error: err3.message });
          res.status(200).json({ message: "Deposit approved and wallet updated" });
        });
      });
    } else {
      const updateStatus = "UPDATE deposits SET status = ? WHERE id = ?";
      db.query(updateStatus, [status, id], (err4) => {
        if (err4) return res.status(500).json({ message: "Failed to update deposit", error: err4.message });
        res.status(200).json({ message: "Deposit rejected" });
      });
    }
  });
};




const getAllDeposits = (req, res) => {
  const sql = `
    SELECT d.id, d.user_id, u.name AS username, d.amount, d.status, d.created_at
    FROM deposits d
    JOIN users u ON d.user_id = u.id
    ORDER BY d.created_at DESC
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ message: "Database error", error: err.message });
    res.status(200).json(result);
  });
};

// ✅ Export both functions
module.exports = {
  createDeposit,
  updateDepositStatus,
  getAllDeposits
};

