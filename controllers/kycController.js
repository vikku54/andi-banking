const db = require("../db/index");

// Get all KYC submissions
const getAllKyc = (req, res) => {
  db.query("SELECT * FROM kyc", (err, results) => {
    if (err) return res.status(500).json({ message: "DB error", error: err.message });
    res.status(200).json(results);
  });
};

// Update KYC status (approve/reject)
const updateKycStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["approved", "rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const sql = "UPDATE kyc SET status = ? WHERE id = ?";
  db.query(sql, [status, id], (err) => {
    if (err) return res.status(500).json({ message: "Update failed", error: err.message });
    res.status(200).json({ message: `KYC ${status}` });
  });
};

 // Create new KYC submission
const createKyc = (req, res) => {
  const { user_id, fullname, aadhaar, pan, document_path } = req.body;

  if (!user_id || !fullname || !aadhaar || !pan || !document_path) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const sql = "INSERT INTO kyc (user_id, fullname, aadhaar, pan, document_path, status) VALUES (?, ?, ?, ?, ?, 'pending')";
  db.query(sql, [user_id, fullname, aadhaar, pan, document_path], (err, result) => {
    if (err) return res.status(500).json({ message: "Insert failed", error: err.message });
    res.status(201).json({ message: "KYC submitted successfully", id: result.insertId });
  });
};

module.exports = {
  getAllKyc,
  updateKycStatus,
  createKyc
};

