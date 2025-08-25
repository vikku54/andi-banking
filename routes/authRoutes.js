const express = require("express");
const router = express.Router();
const { registerUser, loginUser,loginAdmin } = require("../controllers/authController");

// ROUTES
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/admin/login", loginAdmin);

module.exports = router;



