const express = require("express")
const { createdDoctor ,verifyOtp,loginDoctor,
    changepassDoc,
    listDoctor
} = require("../controllers/doctor.controller");
const {  userAuth ,DoctorAuth} = require("../middleware/auth");
const { userAuthRoleBase } = require("../middleware/role.auth");
const { bookAppointment } = require("../controllers/user.controller");

const router = express.Router();

router.post("/createdoctor",   userAuth(),createdDoctor);
router.post("/verifyOtp", verifyOtp);
router.post("/logindoctor", loginDoctor);
router.post("/changepassdoctor",  userAuth(),userAuthRoleBase("doctor"),changepassDoc);
router.get("/list",userAuth(),userAuthRoleBase("doctor"),listDoctor)

router.post("/createuser",bookAppointment);




// router.put("/updatehospital", updateHospital);




module.exports = router;