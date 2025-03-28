const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/admin.model");
const scretKey = "csvscvsvsuwdvdfyd";
const moment = require("moment");
const Hospital = require("../models/hospital.model");


const register = async (req, res) => {
  try {
    const { email, name, password,  role, hospitalId, confirmpass, mobile, } = req.body;

    if (!email || !name || !password || !mobile || !confirmpass) {
      throw new Error("All fields are required.");
    }
    if (password !== confirmpass) {
      throw new Error("Passwords do not match.");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("User already exists with this email.");
    }

    const hashpassword = await bcrypt.hash(password, 8);

    const payload = {
      email,
      exp: moment().add(1, "days").unix(),
    };
    const token = await jwt.sign(payload, scretKey);

    const newAdmin = new User({
      email,
      name,
      password: hashpassword,
      role,
      mobile,
      token,
      createdByHospital: hospitalId, // Linking admin to hospital
      is_active: true,
    });

    await newAdmin.save();

    if (role === "admin") {
      const newHospital = new Hospital({
        name: `Hospital of ${name}`,
        email,
        adress: "Not Provided",
        // createdBy: newAdmin._id, // Storing createdBy (admin ID)
      });

      await newHospital.save();
    }

    return res.status(201).json({ message: `Admin ${name} created successfully.` });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};


const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }

    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
      throw new Error("Invalid password");
    }

    const payload = {
      email: user.email,
    };

    const token = jwt.sign(payload, scretKey, { expiresIn: "1000m" });

    res.cookie("authToken", token, {
      httpOnly: true, // Secure cookie, not accessible via JavaScript
      secure: process.env.NODE_ENV === "production", // Secure in production
      sameSite: "Strict",
      maxAge: 1000 * 60 * 60 * 24, // 1 day expiry
    });

    user.token = token;
    await user.save();
user.name;
    res.status(200).json({
      message: `Login successful and login username is  ${user.name}`,
      success: true,
        user:user.email,  
      status: 200,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { email, name, mobile } = req.body;
    // if (!email && !name && !mobile) {
    //   return res.status(400).json({ message: "At least one field is required for update" });
    // }
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { email, name, mobile } },
      { new: true, runValidators: true } 
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      message: "User updated successfully",
      updatedUser:{
        name: updatedUser.name,
        email: updatedUser.email,
      },
    });

  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};



// const fetchListById = async (req, res) => {
//   try {
// const currentUser = req.user

// console.log(currentUser)
//     // if (!currentUser) {
//     //   throw new Error("User not found");
//     // }

//     if (currentUser.role === "admin") {
//       const allUsers = await User.find();
//       res.status(200).json({ data: allUsers, message: "All users retrieved" });
//     } else {
//       res
//         .status(200)
//         .json({ data: currentUser, message: "Your details retrieved" });
//     }
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

const fetchList = async (req, res) => {
  try {
    // console.log("user", req.user);
  
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default to 10 users per page
    const skip = (page - 1) * limit; // Calculate skip value

    const users = await User.find()
    .select("name email") 
      .skip(skip)
      .limit(limit);

    const totalUsers = await User.countDocuments(); // Count total active users
    const totalPages = Math.ceil(totalUsers / limit);

    res.status(200).json({
      page,
      limit,
      totalUsers,
      totalPages,
      users,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const deletedAt = new Date();
    const aggregationPipeline = [
      { $match: { _id: userId } },
      { 
        $set: { 
          isDeleted: true, 
          deletedAt: deletedAt 
        } 
      },
      { 
        $merge: { into: "users", whenMatched: "merge", whenNotMatched: "discard" } 
      }
    ];
// console.log(deletedAt,"deletedAt");

    await User.aggregate(aggregationPipeline);

    const updatedUser = await User.findById(userId).select("name email isDeleted deletedAt");

    if (!updatedUser) {
      return res.status(500).json({ message: "Error fetching updated user details" });
    }

    return res.status(200).json({
      message: "User soft deleted successfully",
       name:updatedUser.name
    });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const myProfile = async(req,res)=>{
try {
  const user = req.user
   await User.find({user});
  return res.status(200).json({
    message: "You Can Show Profile With Login User",
    user:{ name:user.name,email:user.email,_id:user.id}
  });
} catch (error) {
  
}
}

const logout = async (req, res) => {
  try {
    res.clearCookie("authToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });

    await User.findByIdAndUpdate(req.user._id, { token: null });

    return res.status(200).json({
      message: "Logout successful",
      success: true,
      status: 200,
    });
  } catch (error) {
    return res.status(500).json({ message: "Logout failed", error: error.message });
  }
};



const changePass = async (req, res) => {
  try {
    const user = req.user;
    const { password, confirmpass } = req.body;

    if (!password || !confirmpass) {
      return res.status(400).json({ message: "Both password fields are required" });
    }

    if (password !== confirmpass) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const saltRounds = 10; 
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    user.password = hashedPassword; 
    await user.save(); 

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};





module.exports = {
  register,
  fetchList,
  login,
  updateUser,
  deleteUser,
  myProfile,
  logout,
  changePass
};