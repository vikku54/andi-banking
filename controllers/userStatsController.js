const db = require("../db/index");


const getUserStats = async (req, res) => {
   const userId = req.userId;

  try {
    // Current Balance
   const [wallet] = await db.query(
  `SELECT 
      (COALESCE((SELECT SUM(amount) FROM deposits WHERE user_id = 1 AND status = 'approved'), 0) -
       COALESCE((SELECT SUM(amount) FROM withdrawals WHERE user_id = 1 AND status = 'approved'), 0)) 
       AS balance`,
  [userId, userId]
);

const currentBalance = wallet.length ? wallet[0].balance : 0;


    // Total Deposited
    const [deposits] = await db.query(
      "SELECT IFNULL(SUM(amount),0) AS totalDeposited FROM deposits WHERE user_id = 1 AND status = 'approved'",
      [userId]
    );

    // Pending Other Bank Transactions
    const [pendingOtherBanks] = await db.query(
      "SELECT COUNT(*) AS pendingOtherBanks FROM transactions WHERE user_id = 1 AND status = 'pending'",
      [userId]
    );

    // Total Withdrawals+
     const [withdrawals] = await db.query(
       "SELECT IFNULL(SUM(amount),0) AS totalWithdrawals FROM withdrawals WHERE user_id = 1  AND status = 'approved'",
       [userId]
    );



    // Pending Withdrawals
    const [pendingWithdrawals] = await db.query(
      "SELECT COUNT(*) AS pendingWithdrawals FROM withdrawals WHERE user_id = 1 AND status = 'pending'",
      [userId]
    );

    // Total Transactions
    const [transactions] = await db.query(
      "SELECT COUNT(*) AS totalTransactions FROM transactions WHERE user_id = 1",
      [userId]
    );

    res.json({
      currentBalance,
      totalDeposited: deposits[0].totalDeposited,
      pendingOtherBanks: pendingOtherBanks[0].pendingOtherBanks,
      totalWithdrawals: withdrawals[0].totalWithdrawals,
      pendingWithdrawals: pendingWithdrawals[0].pendingWithdrawals,
      totalTransactions: transactions[0].totalTransactions
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while fetching stats" });
  }
};

module.exports = { getUserStats };
