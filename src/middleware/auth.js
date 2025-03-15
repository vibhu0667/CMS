const jwt = require("jsonwebtoken");
const User = require("../models/admin.model");
const Doctor = require("../models/doctor.model");
const secretKey = "csvscvsvsuwdvdfyd";

const userAuth = () => async (req, res, next) => {
  try {
    // let token = req.cookies.authToken || req.headers.authorization?.replace("Bearer ", ""); 
    const { authToken } = req.cookies;
    // console.log(authToken);
  const token = authToken;
    if (!token) {
      throw new Error("Please authenticate");
    }

    const decoded = jwt.verify(token, secretKey);
    if (!decoded) {
      throw new Error("Invalid token");
    }
   // Check if the authenticated user is an admin or doctor
   let user = await User.findOne({ email: decoded.email });
   let doctor = await Doctor.findOne({ email: decoded.email });


    // let user = await User.findOne({ email: decoded.email });
    // req.user = user;
    if (!user && !doctor) {
      return res.status(404).json({ message: "User not found" });
    }

    // Keep Mongoose document instance
    if (doctor) {
      doctor.role = "doctor"; // Assign role dynamically
      req.user = doctor; // Keep Mongoose instance
    } else {
      req.user = user;
    }


    // Attach user or doctor to the request
    // req.user = user || doctor;

    next();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const DoctorAuth = () => async (req, res, next) => {
  try {
    // let token = req.cookies.authToken || req.headers.authorization?.replace("Bearer ", ""); 
    const { doctorToken } = req.cookies;
    // console.log(authToken);
  const token = doctorToken;
    if (!token) {
      throw new Error("Please authenticate");
    }

    const decoded = jwt.verify(token, secretKey);
    if (!decoded) {
      throw new Error("Invalid token");
    }

    let doctor = await Doctor.findOne({ email: decoded.email });
    req.doctor = doctor;

    next();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


module.exports = { userAuth ,DoctorAuth};
