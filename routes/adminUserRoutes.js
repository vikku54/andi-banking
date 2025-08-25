const express = require("express");
const router = express.Router();
const { getAllUsers,  getBannedUsers, getEmailUnverifiedUsers, getPhoneUnverifiedUsers , getVerifiedUsers , updateUserStatus } = require("../controllers/adminUserController");

// Routes
router.get("/all", getAllUsers);
router.get("/banned", getBannedUsers);
router.get("/email-unverified", getEmailUnverifiedUsers);
router.get("/phone-unverified", getPhoneUnverifiedUsers);
router.get("/verified", getVerifiedUsers);
router.put("/update/:id", updateUserStatus);


module.exports = router;
