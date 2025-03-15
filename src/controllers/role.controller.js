const Role = require("../models/role.model");

const createrole = async (req, res) => {
    try {
      const { role } = req.body;
  
      // if (!role) {
      //   return res.status(400).json({ message: "Role is required" });
      // }
  
      if (!["admin", "doctor"].includes(role)) {
        return res.status(400).json({ message: "Invalid role type" });
      }
  
      const newRole = await Role.create({ role });
  
      res.status(201).json({ message: "Role created successfully", role: newRole });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  };
  

//   const updateHospital = async(req,res)=>{
//     try {
//         const {name,email,adress,number} = req.body
        
//         const updateBook = await Hospital.findByIdAndUpdate({
//             $set :{name,email,adress,number},new : true
//         })
//         res.status(200).json({message:"update hospital sucessfully",data:updateBook})
//     } catch (error) {
//         return res.status(400).json({ message: error.message });
        
//     }
//   }
  module.exports = {
    createrole,
    // updateHospital
  };