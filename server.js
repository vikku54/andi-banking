
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database
const db = require("./db/index");

// Routes
const authRoutes = require("./routes/authRoutes");
const depositRoutes = require("./routes/depositRoutes");
const withdrawRoutes = require("./routes/withdrawRoutes");
const branchRoutes = require("./routes/branchRoutes");
const bankRoutes = require("./routes/bankRoutes");
const kycRoutes = require("./routes/kycRoutes");
const userStatsRoutes = require("./routes/userStatsRoutes");
const statsRoutes = require("./routes/statsRoutes");
const admindepositRoutes = require("./routes/adminDepositsRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const withdrawalRoutes = require("./routes/adminWithdrawalRoutes");
const userRoutes = require("./routes/adminUserRoutes");
const adminKycRoutes = require("./routes/adminKycRoutes");

// Register routes
app.use("/api/auth", authRoutes);
app.use("/api/deposits", depositRoutes);
app.use("/api/withdrawals", withdrawRoutes);
app.use("/api/branches", branchRoutes);
app.use("/api/banks", bankRoutes);
app.use("/api/kyc", kycRoutes);
app.use("/api/user-stats", userStatsRoutes);
app.use("/api", statsRoutes);
app.use("/api/admin/deposits", admindepositRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/withdrawals", withdrawalRoutes);
app.use("/api/users",userRoutes);
app.use("/api/admin/kyc", adminKycRoutes);


// Health check route
app.get("/", (req, res) => {
  res.status(200).json({ message: "ANDi Banking Backend is running ✅" });
});

// Error handling middleware (important!)
app.use((err, req, res, next) => {
  console.error("❌ Backend Error:", err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
