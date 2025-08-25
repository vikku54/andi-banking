const db = require("../db");

// Get all withdrawals
const getAllWithdrawals = async (req, res) => {
  try {
    const [results] = await db.query(
      `SELECT w.*, u.full_name 
       FROM withdrawals w
       JOIN users u ON w.user_id = u.id
       ORDER BY w.created_at DESC`
    );
    res.json(results || []);
  } catch (err) {
    console.error("Error fetching withdrawals:", err);
    res.status(500).json({ error: err.message });
  }
};

// Update withdrawal status
const updateWithdrawalStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await db.query(
      `UPDATE withdrawals SET status = ? WHERE id = ?`,
      [status, id]
    );

    res.json({ message: "Withdrawal status updated successfully" });
  } catch (err) {
    console.error("Error updating withdrawal:", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAllWithdrawals, updateWithdrawalStatus };
