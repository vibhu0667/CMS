const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
 name:{
    type:String,
 },
 email:{
    type:String,
 },

 otp: { type: String },
 createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "admin" },
 password:{
    type:String,
 },
 hospitalId:{
  type: mongoose.Schema.Types.ObjectId, ref: "hospital"
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
//  slot: [{
//   date: { type: Date, required: true },  // Date in YYYY-MM-DD format
//   time: { type: String, required: true }, // Time in HH:MM AM/PM format
//   isBooked: { type: Boolean, default: false }, // Slot status
//   bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: "patient", default: null } // Patient who booked the slot
// }],
workingHours: {
  morning: { start: String, end: String }, // e.g., { start: "09:00 AM", end: "12:00 PM" }
  evening: { start: String, end: String }  // e.g., { start: "05:00 PM", end: "10:00 PM" }
},
breakTime: [
  {
      start: String,
      end: String
  }
],
 isdeleted:{
   type: Boolean,
   default : false
 },
 createdAt:{
   type: Date,
   default: Date.now
},

 updatedAt:{
   type: Date,
   // default: Date.now
},
});

const Doctor = mongoose.model('doctor', doctorSchema);
module.exports = Doctor;