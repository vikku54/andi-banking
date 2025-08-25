const db = require("../db");

// ✅ Get All Users
const getAllUsers = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT id, full_name, email, is_banned, is_email_verified, is_phone_verified, kyc_status FROM users");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Get Verified Users (both email + phone + not banned)
const getVerifiedUsers = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT id, full_name, email FROM users WHERE is_email_verified=1 AND is_phone_verified=1 AND is_banned=0");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};


// ✅ Get Banned Users
const getBannedUsers = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT id, full_name, email FROM users WHERE is_banned=1");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Get Email Unverified Users
const getEmailUnverifiedUsers = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT id, full_name, email FROM users WHERE is_email_verified=0");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Get Phone Unverified Users
const getPhoneUnverifiedUsers = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT id, full_name, email FROM users WHERE is_phone_verified=0");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Update User Status
const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { field, value } = req.body;  // Example: { "field": "is_banned", "value": 1 }

    if (!["is_banned", "is_email_verified", "is_phone_verified", "kyc_status"].includes(field)) {
      return res.status(400).json({ message: "Invalid field update" });
    }

    const [result] = await db.query(`UPDATE users SET ${field}=? WHERE id=?`, [value, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getAllUsers,
  getVerifiedUsers,
  getBannedUsers,
  getEmailUnverifiedUsers,
  getPhoneUnverifiedUsers,
  updateUserStatus
};


