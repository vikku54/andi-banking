const express = require("express");
const router = express.Router();
const { getAllKycRequests, updateKycStatus } = require("../controllers/adminKycController");

// Routes
router.get("/", getAllKycRequests);
router.put("/:id", updateKycStatus);

module.exports = router;
