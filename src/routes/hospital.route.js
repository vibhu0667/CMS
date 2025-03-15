const express = require("express");

// const { userAuth, } = require("../middleware/auth");
const { createhospital,updateHospital } = require("../controllers/hospital.controller");

const router = express.Router();

router.post("/createhospital", createhospital);
router.put("/updatehospital", updateHospital);




module.exports = router;