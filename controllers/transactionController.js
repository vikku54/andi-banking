const db = require("../db");

// Get all transactions
const getAllTransactions = async (req, res) => {
  try {
    const [results] = await db.query(
  `SELECT t.*, u.full_name, b.name as bank_name 
   FROM transactions t 
   JOIN users u ON t.user_id = u.id 
   LEFT JOIN banks b ON t.bank_id = b.id 
   ORDER BY t.trx_time DESC`
);


    // हमेशा array return करो
    res.json(results || []);
  } catch (err) {
    console.error("Error fetching transactions:", err);
    res.status(500).json({ error: err.message, transactions: [] });
  }
};


// Add new transaction
const addTransaction = async (req, res) => {
  try {
    const { user_id, bank_id, amount, charge, account, processing_time, status } = req.body;
    
    const [result] = await db.query(
      `INSERT INTO transactions (user_id, bank_id, amount, charge, account, processing_time, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [user_id, bank_id, amount, charge, account, processing_time, status]
    );

    res.json({ id: result.insertId, ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update transaction
const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, charge, account, processing_time, status } = req.body;

    await db.query(
      `UPDATE transactions 
       SET amount = ?, charge = ?, account = ?, processing_time = ?, status = ? 
       WHERE id = ?`,
      [amount, charge, account, processing_time, status, id]
    );

    res.json({ message: "Transaction updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete transaction
const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query(`DELETE FROM transactions WHERE id = ?`, [id]);
    res.json({ message: "Transaction deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAllTransactions, addTransaction, updateTransaction, deleteTransaction };
