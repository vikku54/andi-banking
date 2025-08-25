
const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// --- Register User ---
const registerUser = async (req, res) => {
  const { full_name, email, phone, password } = req.body;

  if (!full_name || !email || !password) {
    return res.status(400).json({ message: "Please provide all required fields" });
  }

  try {
    // check if email exists
    const [existing] = await db.query("SELECT id FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // insert user
    await db.query(
      "INSERT INTO users (full_name, email, phone, password) VALUES (?, ?, ?, ?)",
      [full_name, email, phone, hashedPassword]
    );

    return res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// --- Login User ---
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please provide email and password" });
  }

  try {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length === 0) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const user = rows[0];

    // check password
    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // generate JWT
    const token = jwt.sign(
      { id: user.id, role: user.role || "user" },
      process.env.JWT_SECRET || "secret123",
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      role: user.role || "user",
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        wallet_balance: user.wallet_balance,
        kyc_status: user.kyc_status,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Admin-login



const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [admin] = await db.query("SELECT * FROM admins WHERE email = ?", [email]);
    if (!admin.length) return res.status(400).json({ message: "Admin not found" });

    const validPassword = await bcrypt.compare(password, admin[0].password);
    if (!validPassword) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign(
      { id: admin[0].id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      role: "admin",
      admin: { id: admin[0].id, email: admin[0].email }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error during admin login" });
  }
};



module.exports = { registerUser, loginUser, loginAdmin };
