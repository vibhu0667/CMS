/* ------------------------------- DEFINE AREA ------------------------------ */
const express = require("express");

/* --------------------------- PATIENT ROUTE PATH --------------------------- */


/* ---------------------------- DOCTOR ROUTE PATH --------------------------- */

// const authRoute = require("./admin/auth.route");
const hospitalRoute = require("./hospital.route");
const adminRoute = require("./admin.route");
const roleRoute = require("./role.route");
const doctorRoute = require("./doctor.route");


const router = express.Router();

/* -------------------------- ROUTE DEFINE -------------------------- */
// router.use("/admin", authRoute);
router.use("/hospital", hospitalRoute);
router.use("/admin", adminRoute);
router.use("/role", roleRoute);
router.use("/doctor",doctorRoute);


module.exports = router;