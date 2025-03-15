const Doctor = require("../models/doctor.model");
const bcrypt = require('bcrypt')
const crypto = require("crypto"); // For generating OTP
const {sendOTPEmail,sendDoctorCredentialsEmail} = require('../utils/sendEmail')
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const createdDoctor = async (req, res) => {
  try {
      if (!req.user) {
          return res.status(401).json({ message: "Unauthorized: Please log in." });
      }

      const { email, name, password, role, hospitalId, confirmpass, mobile,workingHours } = req.body;

      if (!email || !name || !password || !mobile || !confirmpass || !hospitalId) {
          throw new Error("All fields are required, including hospitalId.");
      }
      if (password !== confirmpass) {
          throw new Error("Passwords do not match.");
      }
      if (role && role !== "doctor") {
          throw new Error("Only doctors can be created.");
      }

      const existingUser = await Doctor.findOne({ email });
      if (existingUser) {
          throw new Error("User already exists with this email.");
      }

      const hashpassword = await bcrypt.hash(password, 8);
      const otp = crypto.randomInt(100000, 999999).toString();

      // Convert hospitalId and createdBy to ObjectId
      const hospitalObjectId = new mongoose.Types.ObjectId(hospitalId);
      const createdByObjectId = req.user._id;  

      // Store OTP in doctor document
      const newDoctor = await Doctor.create({
          email,
          name,
          password: hashpassword,
          role: "doctor",
          mobile,
          hospitalId: hospitalObjectId, 
          createdBy: createdByObjectId, 
          is_active: true,
          otp, 
          workingHours
      });

      // Use Aggregation to populate hospital and creator details
      const doctorWithDetails = await Doctor.aggregate([
          { $match: { _id: newDoctor._id } },
          {
              $lookup: {
                  from: "hospitals",
                  localField: "hospitalId",
                  foreignField: "_id",
                  as: "hospitalDetails"
              }
          },
          {
              $lookup: {
                  from: "users",
                  localField: "createdBy",
                  foreignField: "_id",
                  as: "createdByDetails"
              }
          },
          { $unwind: "$hospitalDetails" },
          { $unwind: "$createdByDetails" },
          {
              $project: {
                  name: 1,
                  email: 1,
                  mobile: 1,
                  is_active: 1,
                  workingHours:1,
                  hospitalDetails: {
                      name: 1,
                      address: 1
                  },
                  createdByDetails: {
                      name: 1,
                      email: 1
                  }
              }
          }
      ]);

      await sendOTPEmail(email, otp);
      await sendDoctorCredentialsEmail(email, password);

      return res.status(201).json({
          message: `Doctor ${name} created successfully. OTP & credentials sent to email.`,
          doctor: doctorWithDetails[0] 
      });

  } catch (error) {
      return res.status(400).json({ message: error.message });
  }
};


const verifyOtp = async(req,res)=>{
    try {
        const { email, otp } = req.body;
    
        if (!email || !otp) {
          return res.status(400).json({ message: "Email and OTP are required." });
        }
    
        // Find doctor by email
        const doctor = await Doctor.findOne({ email });
    
        if (!doctor) {
          return res.status(404).json({ message: "Doctor not found." });
        }
    
        // Check if OTP matches
        if (doctor.otp !== otp) {
          return res.status(400).json({ message: "Invalid OTP." });
        }
    
        // Update doctor: remove OTP and mark as verified
        doctor.otp = null; 
        doctor.is_verified = true;
        await doctor.save();
    
        return res.status(200).json({ message: "OTP verified successfully." });
    
      } catch (error) {
        return res.status(500).json({ message: error.message });
      }
}


const loginDoctor = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Check if both fields are provided
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
      }
  
      // Find doctor by email
      const doctor = await Doctor.findOne({ email });
  
      if (!doctor) {
        return res.status(404).json({ message: "Doctor not found." });
      }
  
      // Check if the doctor is active
      if (!doctor.is_active) {
        return res.status(403).json({ message: "Your account is not active. Please contact admin." });
      }
  
      // Verify password
      const isPasswordValid = await bcrypt.compare(password, doctor.password);
  
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials. Please try again." });
      }
  
      // Generate JWT Token
      const token = jwt.sign(
        { id: doctor._id, email: doctor.email, role: doctor.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" } // Token expires in 1 day
      );
  
      res.cookie("authToken", token, {
        httpOnly: true, // Secure cookie, not accessible via JavaScript
        secure: process.env.NODE_ENV === "production", // Secure in production
        sameSite: "Strict",
        maxAge: 1000 * 60 * 60 * 24, // 1 day expiry
      });
      doctor.token = token;
      await doctor.save();
      doctor.name;
      // Return response
      return res.status(200).json({
        message: "Login successful",
        // token,
        doctor: {
          id: doctor._id,
          name: doctor.name,
          email: doctor.email,
          role: doctor.role,
        },
      });
  
    } catch (error) {
      return res.status(500).json({ message: "Internal server error", error: error.message });
    }
  };
  

const changepassDoc = async (req, res) => {
    try {

      const doctor = req.user
      console.log(doctor,"doctor doctor")
  
      const { oldPassword, newPassword, confirmPassword } = req.body;
  
      // Validate input
      if (!oldPassword || !newPassword || !confirmPassword) {
        return res.status(400).json({ message: "All fields are required." });
      }
  
      // Check if the old password is correct
      const isPasswordValid = await bcrypt.compare(oldPassword, doctor.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Incorrect old password." });
      }
  
      // Ensure new password is different from old password
      if (oldPassword === newPassword) {
        return res.status(400).json({ message: "New password must be different from old password." });
      }
  
      // Check if new password matches confirm password
      if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: "New password and confirm password do not match." });
      }
  
      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 8);
  
      // Update password in database
      doctor.password = hashedPassword;
      await doctor.save();
  
      return res.status(200).json({ message: "Password changed successfully." });
  
    } catch (error) {
      return res.status(500).json({ message: "Internal server error", error: error.message });
    }
  };

  // const listDoctor = async (req, res) => {
  //   try {
  //     // Get the logged-in doctor
  //     const doctor = req.user;
  
  //     // Ensure only doctors can access their own data
  //     if (!doctor || doctor.role !== "doctor") {
  //       return res.status(403).json({ message: "Access denied" });
  //     }
  
  //     // Fetch the logged-in doctor's details
  //     const doctorDetails = await Doctor.findById(doctor._id);
      
  //     if (!doctorDetails) {
  //       return res.status(404).json({ message: "Doctor not found" });
  //     }
  
  //     res.status(200).json({ doctor: doctorDetails });
  
  //   } catch (error) {
  //     return res.status(500).json({ message: "Internal server error", error: error.message });
  //   }
  // };
  
  const listDoctor = async (req, res) => {
    try {
      const doctor = req.user;
    
      if (!doctor || doctor.role !== "doctor") {
        return res.status(403).json({ message: "Access denied" });
      }
  
      // MongoDB Aggregation Pipeline
      const doctorDetails = await Doctor.aggregate([
        { $match: { _id: doctor._id } },
        {
          $lookup: {
            from: "admins",
            localField: "createdBy",
            foreignField: "_id",
            as: "adminInfo"
          }
        },
        
        {
          $lookup: {
            from: "hospitals",
            localField: "hospitalId",
            foreignField: "_id",
            as: "hospitalInfo"
          }
        },
        {
          $project: {
            "adminInfo._id":1,
            "adminInfo.name": 1,
            "hospitalInfo.name":1,
            "hospitalInfo._id":1,
            "hospitalInfo.email":1,
            "hospitalInfo.adress":1,

            name:1,
            email:1,
            mobile:1
          }
          
        }
      ]);
  
      if (!doctorDetails || doctorDetails.length === 0) {
        return res.status(404).json({ message: "Doctor not found" });
      }
  
      res.status(200).json({ doctor: doctorDetails[0] }); // Send the first (only) result
  
    } catch (error) {
      return res.status(500).json({ message: "Internal server error", error: error.message });
    }
  };
  

  const updateDoctor = async(req,res)=>{
const {}= req.body
  }

  module.exports = {
    createdDoctor,
    verifyOtp,
    loginDoctor,
    changepassDoc,listDoctor,
    updateDoctor
  };