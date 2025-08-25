const db = require("../db"); // MySQL connection

// Get all stats
const getStats = async (req, res) => {
  try {
    const [users] = await db.query("SELECT COUNT(*) AS total FROM users");
    const [banned] = await db.query("SELECT COUNT(*) AS total FROM users WHERE is_banned=1");
    const [emailUnverified] = await db.query("SELECT COUNT(*) AS total FROM users WHERE is_email_verified=0");
    const [phoneUnverified] = await db.query("SELECT COUNT(*) AS total FROM users WHERE is_phone_verified=0");

    const [depositWallet] = await db.query("SELECT SUM(amount) AS total FROM deposits");
    const [interestWallet] = await db.query("SELECT SUM(charge) AS total FROM deposits");

    const [deposits] = await db.query("SELECT COUNT(*) AS total, SUM(amount) AS sum, SUM(charge) AS charges FROM deposits WHERE status = 'approved'");
    const [transactions] = await db.query("SELECT COUNT(*) AS approved, SUM(amount) AS sum FROM transactions");
    
    const [withdraws] = await db.query("SELECT COUNT(*) AS approved, SUM(amount) AS sum, SUM(charge) AS charges FROM withdrawals WHERE status ='approved'");
    const [totalWithdraws] = await db.query("SELECT COUNT(*) AS total FROM withdrawals");
    const [pendingWithdraws]  = await db.query("SELECT COUNT(*) AS total FROM withdrawals WHERE status = 'pending'");
    const [rejectedWithdraws]  = await db.query("SELECT COUNT(*) AS total FROM withdrawals WHERE status = 'rejected'");

    res.json({
      users: {
        total: users[0].total,
        banned: banned[0].total,
        emailUnverified: emailUnverified[0].total,
        phoneUnverified: phoneUnverified[0].total,
      },
      finance: {
        depositWallet: depositWallet[0].total || 0,
        interestWallet: interestWallet[0].total || 0,
      },
      deposits: {
        count: deposits[0].total || 0,
        amount: deposits[0].sum || 0,
        charges: deposits[0].charges || 0,
      },
      transactions: {
        count: transactions[0].total || 0,
        amount: transactions[0].sum || 0,
        charges: transactions[0].charges || 0,
      },
      withdraws: {
        count: withdraws[0].approved || 0,
        amount: withdraws[0].sum || 0,
        charges: withdraws[0].charges || 0,
      },
      totalWithdraws: {
        count: totalWithdraws[0].total || 0
      },
      pendingWithdraws: {
        count: pendingWithdraws[0].total || 0
      },
      rejectedWithdraws: {
        count: rejectedWithdraws[0].total || 0
      }
    });
  } catch (err) {
    console.error("Error fetching stats:", err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { getStats };
