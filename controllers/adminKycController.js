const db = require("../db");

// ✅ Get all KYC requests
const getAllKycRequests = async (req, res) => {
  try {
    const [results] = await db.query(
      `SELECT k.*, u.full_name AS user_name, u.email 
       FROM kyc k
       JOIN users u ON k.user_id = u.id
       ORDER BY k.created_at DESC`
    );
    res.json(results);
  } catch (error) {
    console.error("Error fetching KYC requests:", error);
    res.status(500).json({ message: "Server error fetching KYC requests" });
  }
};

// ✅ Update KYC status
const updateKycStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    await db.query("UPDATE kyc SET status = ? WHERE id = ?", [status, id]);
    res.json({ message: "KYC status updated successfully" });
  } catch (error) {
    console.error("Error updating KYC status:", error);
    res.status(500).json({ message: "Server error updating KYC status" });
  }
};

module.exports = { getAllKycRequests, updateKycStatus };
