// controllers/adminDepositsController.js
const db = require("../db"); // make sure this is the promise pool

// ✅ Get all deposits
const getAllDeposits = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT deposits.id, deposits.amount, deposits.status, deposits.created_at,
              users.full_name, users.email
       FROM deposits
       JOIN users ON deposits.user_id = users.id
       ORDER BY deposits.created_at DESC`
    );

    res.json(rows);
  } catch (error) {
    console.error("❌ Error fetching deposits:", error);
    res.status(500).json({ message: "Server error while fetching deposits" });
  }
};

// ✅ Update deposit status
const updateDepositStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["approved", "rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  try {
    const [result] = await db.query(
      "UPDATE deposits SET status = ? WHERE id = ?",
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Deposit not found" });
    }

    res.json({ message: `Deposit ${status} successfully` });
  } catch (error) {
    console.error("❌ Error updating deposit status:", error);
    res.status(500).json({ message: "Server error while updating deposit status" });
  }
};

module.exports = { getAllDeposits, updateDepositStatus };
