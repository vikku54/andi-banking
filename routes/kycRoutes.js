const express = require("express");
const router = express.Router();
const { getAllKyc, updateKycStatus,createKyc } = require("../controllers/kycController");

router.get("/", getAllKyc);
router.put("/update/:id", updateKycStatus);
router.post("/", createKyc); 

module.exports = router;
