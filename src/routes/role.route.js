const express = require("express");

// const { userAuth, } = require("../middleware/auth");

const { createrole } = require("../controllers/role.controller");

const router = express.Router();

router.post("/createRole", createrole);
// router.put("/updatehospital", updateHospital);




module.exports = router;