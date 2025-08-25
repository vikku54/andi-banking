const db = require("../db");

// Create new branch
const createBranch = (req, res) => {
  const { name, address, city, state, zip_code } = req.body;

  if (!name || !address) {
    return res.status(400).json({ message: "Branch name and address are required" });
  }

  const sql = "INSERT INTO branches (name, address, city, state, zip_code) VALUES (?, ?, ?, ?, ?)";
  db.query(sql, [name, address, city, state, zip_code], (err, result) => {
    if (err) return res.status(500).json({ message: "Failed to create branch", error: err.message });

    res.status(201).json({ message: "Branch created successfully", branchId: result.insertId });
  });
};

// Get All Branches
const getAllBranches = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM branches"); // ✅ no callback
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching branches:", error);
    res.status(500).json({ message: "Error fetching branches" });
  }
};

// Delete a branch
const deleteBranch = (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM branches WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ message: "Failed to delete branch", error: err.message });

    res.status(200).json({ message: "Branch deleted successfully" });
  });
};

module.exports = {
  createBranch,
  getAllBranches,
  deleteBranch
};
