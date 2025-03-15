const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
 name:{
    type:String,
 },
 email:{
    type:String,
 },

 otp: { type: String },
 hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: "hospital" },
 password:{
    type:String,
 },
 role:{
   type:String,
   enum:['user','admin','doctor'],
   default:"user"
 },
 mobile: {
   type: Number,
   required: true,
   unique: true,
   validate: {
     validator: function (v) {
       return /^[0-9]{10}$/.test(v.toString()); // Ensures exactly 10 digits
     },
     message: (props) => `${props.value} is not a valid 10-digit mobile number!`,
   },
 },
 is_active:{
    type:Boolean,
 },
 isdeleted:{
   type: Boolean,
   default : false
 },
 createdAt:{
   type: Date,
   default: Date.now
},
createdByHospital:{
    type: mongoose.Schema.Types.ObjectId, ref: "hospital" ,

},
 updatedAt:{
   type: Date,
   // default: Date.now
},
});

const Admin = mongoose.model('admin', adminSchema);
module.exports = Admin;