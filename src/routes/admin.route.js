const express = require("express");

const { register,login } = require("../controllers/auth.controller");


// const { userAuth, } = require("../middleware/auth");


const router = express.Router();

router.post("/registerUser",register);
router.post("/login", login);

// router.post("/createDoctor",)






module.exports = router;