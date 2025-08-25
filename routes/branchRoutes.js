const express = require("express");
const router = express.Router();
const branchController = require("../controllers/branchController");

router.post("/create", branchController.createBranch);
router.get("/all", branchController.getAllBranches);
router.delete("/delete/:id", branchController.deleteBranch);


module.exports = router;
