const express = require("express");
const router = express.Router();
const { getBanks, addBank, updateBank, deleteBank } = require("../controllers/bankController");

router.get("/", getBanks);
router.post("/", addBank);
router.put("/:id", updateBank);
router.delete("/:id", deleteBank);

module.exports = router;
