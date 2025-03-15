const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
 name:{
    type:String,
 },
 email:{
    type:String,
 },
 adress:{
    type:String,
 },
 number:{
    type: Number
 },
 createdAt:{
   type: Date,
   default: Date.now
},
 updatedAt:{
   type: Date,
   // default: Date.now
},
deletedAt:{
   type: Date,
   // default: Date.now
},
createdBy: {
   type: mongoose.Schema.Types.ObjectId,
   ref: "admin", // Store admin who created this hospital
 },
updatedBy: { // Adding updatedBy field
   type:  { type: mongoose.Schema.Types.ObjectId, ref: "admin" }, // You can change this to ObjectId if referencing a user
}
},{
    timeStamp:true,
    versionKey:false,
});

const Hospital = mongoose.model('hospital', hospitalSchema);
module.exports = Hospital;