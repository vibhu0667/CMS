const Hospital = require("../models/hospital.model");

 const  createhospital = async (req, res) => {
    try {
        // superadmin should  create new hospital 
    //   const user = req.user;
      const {name,email,adress,number}= req.body
      const newhospital = new Hospital({
        name,
        email,
        adress,
        number,

        // createdBy: { _id: user.id, name: user.name,
        //   email: user.email,}, 
        createdAt: new Date(),
      });
  
      const savedhospital = await newhospital.save();
  
      return res.status(201).json({
        message: "hsopital created successfully",
        data: {
          name: savedhospital.name,
          email: savedhospital.email,
          adress: savedhospital.adress,
          number: savedhospital.number,
        },
      });
  
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  };


  const updateHospital = async(req,res)=>{
    try {
        const {name,email,adress,number} = req.body
        
        const updateBook = await Hospital.findByIdAndUpdate({
            $set :{name,email,adress,number},new : true
        })
        res.status(200).json({message:"update hospital sucessfully",data:updateBook})
    } catch (error) {
        return res.status(400).json({ message: error.message });
        
    }
  }
  module.exports = {
    createhospital,
    updateHospital
 
  };