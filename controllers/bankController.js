const db = require("../db");

// Get all banks
const getBanks = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM banks");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching banks:", err);
    res.status(500).json({ error: "Error fetching banks" });
  }
};

// Add new bank
const addBank = async (req, res) => {
  try {
    const {
      name,
      min_amount,
      max_amount,
      fixed_charge,
      percent_charge,
      processing_time,
      status,
    } = req.body;

    const sql = `
      INSERT INTO banks 
      (name, min_amount, max_amount, fixed_charge, percent_charge, processing_time, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(sql, [
      name,
      min_amount,
      max_amount,
      fixed_charge,
      percent_charge,
      processing_time,
      status,
    ]);

    res.json({ message: "Bank added successfully", id: result.insertId });
  } catch (err) {
    console.error("Error adding bank:", err);
    res.status(500).json({ error: "Error adding bank" });
  }
};

// Update bank
const updateBank = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      min_amount,
      max_amount,
      fixed_charge,
      percent_charge,
      processing_time,
      status,
    } = req.body;

    const sql = `
      UPDATE banks 
      SET name=?, min_amount=?, max_amount=?, fixed_charge=?, percent_charge=?, processing_time=?, status=? 
      WHERE id=?
    `;

    await db.query(sql, [
      name,
      min_amount,
      max_amount,
      fixed_charge,
      percent_charge,
      processing_time,
      status,
      id,
    ]);

    res.json({ message: "Bank updated successfully" });
  } catch (err) {
    console.error("Error updating bank:", err);
    res.status(500).json({ error: "Error updating bank" });
  }
};

// Delete bank
const deleteBank = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM banks WHERE id=?", [id]);
    res.json({ message: "Bank deleted successfully" });
  } catch (err) {
    console.error("Error deleting bank:", err);
    res.status(500).json({ error: "Error deleting bank" });
  }
};

module.exports = { getBanks, addBank, updateBank, deleteBank };
